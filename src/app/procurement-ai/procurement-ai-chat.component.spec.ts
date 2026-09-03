import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { ProcurementAiChatComponent } from './procurement-ai-chat.component';
import { ProcurementAiChatService } from './procurement-ai-chat.service';

describe('ProcurementAiChatComponent', () => {
  let component: ProcurementAiChatComponent;
  let fixture: ComponentFixture<ProcurementAiChatComponent>;
  let chatService: jasmine.SpyObj<ProcurementAiChatService>;

  beforeEach(async () => {
    chatService = jasmine.createSpyObj('ProcurementAiChatService', ['sendMessage']);

    await TestBed.configureTestingModule({
      declarations: [ProcurementAiChatComponent],
      imports: [FormsModule, MatButtonModule, MatIconModule],
      providers: [
        { provide: ProcurementAiChatService, useValue: chatService },
        { provide: Router, useValue: { events: of() } }
      ]
    }).compileComponents();

    sessionStorage.setItem('token', 'test-token');
    fixture = TestBed.createComponent(ProcurementAiChatComponent);
    component = fixture.componentInstance;
    component.isAuthenticated = true;
    component.panelOpen = true;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('displays suggested questions when returned by the API', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'The status of PO test123 is PENDING.',
      source: 'PURCHASE_ORDER',
      suggestedQuestions: [
        'Show me the details of PO test123',
        'Which supplier is associated with PO test123?'
      ]
    }));

    component.draftMessage = 'What is the status of PO test123?';
    component.send();
    fixture.detectChanges();

    const suggestionChips = fixture.nativeElement.querySelectorAll('.procurement-ai-suggestion-chip');
    expect(suggestionChips.length).toBe(2);
    expect(suggestionChips[0].textContent).toContain('Show me the details of PO test123');
  });

  it('does not display suggestions when the array is empty', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'Please provide a purchase order number.',
      source: null,
      suggestedQuestions: []
    }));

    component.draftMessage = 'Hello';
    component.send();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.procurement-ai-suggestions')).toBeNull();
    expect(component.messages[component.messages.length - 1].suggestedQuestions).toBeUndefined();
  });

  it('sends the exact clicked suggested question through the existing chat flow', () => {
    chatService.sendMessage.and.returnValues(
      of({
        message: 'The status of PO test123 is PENDING.',
        source: 'PURCHASE_ORDER',
        suggestedQuestions: ['Show me the details of PO test123']
      }),
      of({
        message: 'PO test123 details...',
        source: 'PURCHASE_ORDER',
        suggestedQuestions: []
      })
    );

    component.draftMessage = 'What is the status of PO test123?';
    component.send();
    fixture.detectChanges();

    component.onSuggestedQuestionClick('Show me the details of PO test123');
    fixture.detectChanges();

    expect(chatService.sendMessage).toHaveBeenCalledTimes(2);
    expect(chatService.sendMessage).toHaveBeenCalledWith('Show me the details of PO test123');
    expect(component.messages.filter(message => message.fromUser).map(message => message.text)).toContain(
      'Show me the details of PO test123'
    );
  });

  it('displays suggestions only on the AI message that returned them', () => {
    chatService.sendMessage.and.returnValues(
      of({
        message: 'First response',
        source: 'PURCHASE_ORDER',
        suggestedQuestions: ['Follow up question']
      }),
      of({
        message: 'Second response',
        source: 'PURCHASE_ORDER',
        suggestedQuestions: ['Another follow up']
      })
    );

    component.draftMessage = 'First question';
    component.send();
    component.onSuggestedQuestionClick('Follow up question');
    fixture.detectChanges();

    const suggestionLists = fixture.nativeElement.querySelectorAll('.procurement-ai-suggestion-list');
    expect(suggestionLists.length).toBe(2);
    expect(suggestionLists[0].textContent).toContain('Follow up question');
    expect(suggestionLists[1].textContent).toContain('Another follow up');
  });

  it('keeps normal typed-question behavior working', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'Typed response',
      source: 'PURCHASE_ORDER',
      suggestedQuestions: []
    }));

    component.draftMessage = 'Typed question';
    component.send();
    fixture.detectChanges();

    expect(chatService.sendMessage).toHaveBeenCalledWith('Typed question');
    expect(component.draftMessage).toBe('');
    expect(component.messages[0]).toEqual({ text: 'Typed question', fromUser: true });
    expect(component.messages[1].text).toBe('Typed response');
  });

  it('prevents duplicate submissions while a request is in progress', () => {
    chatService.sendMessage.and.returnValue(of({
      message: 'Response',
      source: 'PURCHASE_ORDER',
      suggestedQuestions: ['Next question']
    }));

    component.isLoading = true;
    component.onSuggestedQuestionClick('Next question');

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });
});
