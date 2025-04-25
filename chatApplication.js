// User class with automatic ID assignment
class User {
    static nextId = 1; // Static counter for unique IDs

    constructor(name) {
        this.id = User.nextId++; // Assign and increment unique ID
        this.name = name;
    }
}
class ChatApp {
    static messages = []; // Shared message store

    constructor(user) {
        this.user = user; // user object: { id, name }
    }

    // Send a message to another user (by receiverId)
    sendMessage(receiverId, text) {
        if (this.user.id === receiverId) {
            console.log("You cannot send a message to yourself.");
            return;
        }
        const message = {
            id: Date.now() + Math.random(),
            senderId: this.user.id,
            receiverId: receiverId,
            text: text,
            timestamp: new Date().toLocaleString()
        };
        ChatApp.messages.push(message);
        console.log(`Message sent to userID ${receiverId}`);
    }

    // Edit your own message (by message id)
    editMessage(messageId, newText) {
        const msg = ChatApp.messages.find(
            m => m.id === messageId && m.senderId === this.user.id
        );
        if (msg) {
            msg.text = newText;
            console.log(`Message edited by (userID ${this.user.id} name ${this.user.name})`);
        } else {
            console.log("Message not found");
        }
    }

    // Delete your own message (by message id)
    deleteMessage(messageId) {
        const msg = ChatApp.messages.find(
            m => m.id === messageId && m.senderId === this.user.id
        );
        if (msg) {
            msg.text = "deleted";
            console.log(`Message deleted by (userID ${this.user.id} name ${this.user.name})`);
        } else {
            console.log("Message not found");
        }
    }

    // Read all messages with another user (by userId)
    readAllMessages(withUserId) {
        const chat = ChatApp.messages.filter(
            m =>
                (m.senderId === this.user.id && m.receiverId === withUserId) ||
                (m.senderId === withUserId && m.receiverId === this.user.id)
        );
        if (chat.length === 0) {
            console.log("No messages to display.");
        } else {
            console.log(`All messages between userID ${this.user.id} and userID ${withUserId}:`);
            chat.forEach(m =>
                console.log(`[${m.timestamp}] (From userID ${m.senderId}): ${m.text}`)
            );
        }
    }

    // Read the last message with another user (by userId)
    readLastMessage(withUserId) {
        const chat = ChatApp.messages.filter(
            m =>
                (m.senderId === this.user.id && m.receiverId === withUserId) ||
                (m.senderId === withUserId && m.receiverId === this.user.id)
        );
        if (chat.length === 0) {
            console.log("No messages to display.");
        } else {
            const last = chat[chat.length - 1];
            console.log(`[${last.timestamp}] (From ${last.senderId}): ${last.text}`);
        }
    }
}

const avinash = new User("Avinash");
const rahul = new User("Rahul");

const avinashApp = new ChatApp(avinash);
const rahulApp = new ChatApp(rahul);

avinashApp.sendMessage(rahul.id, "Hello Rahul!");
avinashApp.sendMessage(rahul.id, "How are you?");

// Find message IDs for editing/deleting
const firstMsgId = ChatApp.messages[0].id;
const secondMsgId = ChatApp.messages[1].id;

rahulApp.readAllMessages(avinash.id);

avinashApp.editMessage(secondMsgId, "How's everything?");
avinashApp.deleteMessage(firstMsgId);

rahulApp.readLastMessage(avinash.id);
rahulApp.readAllMessages(avinash.id);
