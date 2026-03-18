exports.calculateTicketSummary = (ticket) => {
  const remainingCount = ticket.remaining_count;
  const usedCount = ticket.target_count - ticket.remaining_count;
  const pricePerSession = Math.floor(ticket.total_price / ticket.target_count);

  return {
    remainingCount,
    usedCount,
    pricePerSession
  };
};