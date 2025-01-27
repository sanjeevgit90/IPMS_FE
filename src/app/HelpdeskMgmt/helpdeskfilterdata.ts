export class TicketFilterSession {
    ticketNo: string;
    priority: string;
    accountName: string;
    state:string;
    district:string;
    location:string;
    assetid:string;
    ticketStatus:string;
}

export class TicketMISFilterSession {
    ticketNo: string;
    priority: string;
    accountName: string;
    state:string;
    district:string;
    location:string;
    fromDate:string;
    toDate:string;
    ticketStatus:string;
}

export class TicketSLAFilterSession {
    ticketNo: string;
    priority: string;
    accountName: string;
    fromDate:string;
    toDate:string;
}

export class TicketAgingFilterSession {
    ticketNo: string;
    priority: string;
    accountName: string;
    ticketStatus:string;
    vendorName:string;
}

export class VehicleFilterSession {
    vehicleType: string;
    vehicleName: string;
    vehicleRegNumber: string;
}

export class SupportFilterSession {
    firstName: string;
    lastName: string;
    employeeId: string;
}
export class IncidentFilterSession {
    ticketNo: string;
    priority: string;
    accountName: string;
    state: string;
    district: string;
    fromDate: string;
    toDate: string;
}