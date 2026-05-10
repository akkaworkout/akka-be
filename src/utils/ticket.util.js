exports.calculateTicketSummary = (ticket) => {
  const remainingCount = ticket.remaining_count;
  const usedCount = ticket.target_count - ticket.remaining_count;
  const amountPerSession = Math.floor(ticket.total_amount / ticket.target_count);

  return {
    remainingCount,
    usedCount,
    amountPerSession
  };
};