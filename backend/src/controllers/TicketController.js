export class TicketController {
  constructor(ticketService) {
    this.ticketService = ticketService;
  }

  getTickets = (req, res, next) => {
    try {
      const { status } = req.query;
      const tickets = this.ticketService.getAllTickets(status);
      const meta = this.ticketService.getTicketCounts();
      return res.status(200).json({
        success: true,
        count: tickets.length,
        meta,
        data: tickets
      });
    } catch (error) {
      next(error);
    }
  };

  createTicket = (req, res, next) => {
    try {
      const newTicket = this.ticketService.createTicket(req.body);
      return res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: newTicket
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedTicket = this.ticketService.updateTicketStatus(id, status);
      return res.status(200).json({
        success: true,
        message: 'Ticket status updated successfully',
        data: updatedTicket
      });
    } catch (error) {
      next(error);
    }
  };
}
