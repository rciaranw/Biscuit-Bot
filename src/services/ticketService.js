const Counter = require("../database/models/Counter");
const Ticket = require("../database/models/Ticket");

/**
 * Get the next sequential ticket ID
 */
async function getNextTicketId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "ticket" },
        { $inc: { value: 1 } },
        {
            new: true,
            upsert: true,
            returnDocument: "after"
        }
    );

    return counter.value;
}

/**
 * Format a ticket number as 0001, 0002 etc.
 */
function formatTicketId(ticketId) {
    return ticketId.toString().padStart(4, "0");
}

/**
 * Create a ticket
 */
async function createTicket({
    guildId,
    userId,
    type,
    reason,
    channelId
}) {
    const ticketId = await getNextTicketId();

    return Ticket.create({
        ticketId,
        guildId,
        userId,
        type,
        reason,
        channelId,
        status: "Open",
        referred: false,
        openedAt: new Date()
    });
}

/**
 * Get ticket by numeric ID
 */
async function getTicket(ticketId) {
    return Ticket.findOne({ ticketId });
}

/**
 * Get ticket by channel ID
 */
async function getTicketByChannel(channelId) {
    return Ticket.findOne({ channelId });
}

/**
 * Check whether a user already has an open ticket
 */
async function getOpenTicketForUser(userId) {
    return Ticket.findOne({
        userId,
        status: "Open"
    });
}

/**
 * Mark a ticket as referred
 */
async function referTicket(ticketId) {
    return Ticket.findOneAndUpdate(
        { ticketId },
        {
            referred: true
        },
        {
            new: true
        }
    );
}

/**
 * Close a ticket
 */
async function closeTicket(ticketId, closedBy) {
    return Ticket.findOneAndUpdate(
        { ticketId },
        {
            status: "Closed",
            closedAt: new Date(),
            closedBy
        },
        {
            new: true
        }
    );
}

module.exports = {
    getNextTicketId,
    formatTicketId,
    createTicket,
    getTicket,
    getTicketByChannel,
    getOpenTicketForUser,
    referTicket,
    closeTicket
};