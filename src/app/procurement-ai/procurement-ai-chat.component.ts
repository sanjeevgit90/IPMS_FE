import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatMessage } from './models/procurement-chat.model';
import { ProcurementAiChatService } from './procurement-ai-chat.service';

@Component({
  selector: 'app-procurement-ai-chat',
  templateUrl: './procurement-ai-chat.component.html',
  styleUrls: ['./procurement-ai-chat.component.css'],
  standalone: false
})
export class ProcurementAiChatComponent {

  @ViewChild('chatScroll') chatScroll?: ElementRef<HTMLDivElement>;

  panelOpen = false;
  isLoading = false;
  draftMessage = '';
  isAuthenticated = false;
  messages: ChatMessage[] = [];

  private readonly welcomeMessage =
    'Hi! Ask me about purchase order status, for example: "What is the status of PO test123?"';

  constructor(
    private chatService: ProcurementAiChatService,
    private router: Router
  ) {
    this.refreshAuthState();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.refreshAuthState();
    });
  }

  get canSend(): boolean {
    return !this.isLoading && !!this.draftMessage.trim();
  }

  togglePanel(): void {
    if (!this.isAuthenticated) {
      return;
    }
    this.panelOpen = !this.panelOpen;
    if (this.panelOpen && this.messages.length === 0) {
      this.messages.push({ text: this.welcomeMessage, fromUser: false });
    }
    if (this.panelOpen) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  send(): void {
    const text = this.draftMessage.trim();
    if (!text || this.isLoading || !this.isAuthenticated) {
      return;
    }

    this.messages.push({ text, fromUser: true });
    this.draftMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.chatService.sendMessage(text).subscribe({
      next: (response) => {
        this.messages.push({ text: response.message, fromUser: false });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error: HttpErrorResponse) => {
        this.messages.push({
          text: this.resolveErrorMessage(error),
          fromUser: false,
          isError: true
        });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private refreshAuthState(): void {
    this.isAuthenticated = !!sessionStorage.getItem('token');
    if (!this.isAuthenticated) {
      this.panelOpen = false;
      this.messages = [];
      this.draftMessage = '';
      this.isLoading = false;
    }
  }

  private resolveErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 403) {
      return 'You do not have permission to use the procurement AI assistant.';
    }
    if (error.status === 503) {
      return 'The AI assistant is temporarily unavailable. Please try again later.';
    }
    return 'Something went wrong while contacting the AI assistant. Please try again.';
  }

  private scrollToBottom(): void {
    const element = this.chatScroll?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
