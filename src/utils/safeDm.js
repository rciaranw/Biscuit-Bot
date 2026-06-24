// utils/safeDm.js

async function safeDm(user, content) {
    try {
        await user.send(content);
        return { success: true };
    } catch (err) {
        // Discord error 50007 = cannot send messages to user
        if (err.code === 50007) {
            console.log(`DM blocked for user: ${user.id}`);
        } else {
            console.log(`DM error for user ${user.id}:`, err);
        }

        return {
            success: false,
            error: err.code || "UNKNOWN_ERROR"
        };
    }
}

module.exports = { safeDm };