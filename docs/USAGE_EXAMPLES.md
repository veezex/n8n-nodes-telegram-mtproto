# Telegram MTPROTO API Node - Usage Examples

## Basic Message Listener

Here's how to set up a basic workflow that listens for new messages:

### Workflow Configuration

1. **Telegram MTPROTO API Trigger**
   - Events: `New Message`
   - Ignore Groups: `false` (to receive group messages)
   - Ignore Bots: `true` (to ignore bot messages)

2. **Function Node** (to process messages)
   ```javascript
   // Process incoming Telegram message
   const message = $json;
   
   return {
     messageId: message.messageId,
     text: message.text,
     senderId: message.senderId,
     chatId: message.chatId,
     isGroup: message.isGroup,
     timestamp: new Date(message.date * 1000).toISOString()
   };
   ```

3. **HTTP Request Node** (to send to webhook or API)
   - Method: `POST`
   - URL: `https://your-api.com/webhook`
   - Body: Use the processed data from Function node

## Message Filtering

To filter messages by content or sender:

```javascript
// In a Function node after the trigger
const message = $json;

// Only process messages containing specific keywords
const keywords = ['urgent', 'important', 'help'];
if (!keywords.some(keyword => message.text.toLowerCase().includes(keyword))) {
  return null; // Skip this message
}

// Only process messages from specific users
const allowedUsers = ['123456789', '987654321'];
if (!allowedUsers.includes(message.senderId)) {
  return null; // Skip this message
}

return message;
```

## Auto-Reply Bot

Create a simple auto-reply bot:

1. **Telegram MTPROTO API Trigger** (listens for messages)
2. **Function Node** (processes and decides response)
3. **Telegram Send Message Node** (sends reply)

Function Node logic:
```javascript
const message = $json;

// Don't reply to groups or channels
if (message.isGroup || message.isChannel) {
  return null;
}

// Simple keyword-based responses
const responses = {
  'hello': 'Hi there! How can I help you?',
  'help': 'I can assist you with various tasks. What do you need help with?',
  'bye': 'Goodbye! Have a great day!'
};

const messageText = message.text.toLowerCase();
let reply = null;

for (const [keyword, response] of Object.entries(responses)) {
  if (messageText.includes(keyword)) {
    reply = response;
    break;
  }
}

if (!reply) {
  reply = 'Sorry, I didn\'t understand that. Type "help" for assistance.';
}

return {
  chatId: message.chatId,
  text: reply,
  originalMessage: message
};
```

## Message Logging

Log all messages to a database or file:

1. **Telegram MTPROTO API Trigger**
2. **Function Node** (format data)
   ```javascript
   const message = $json;
   
   return {
     timestamp: new Date().toISOString(),
     messageId: message.messageId,
     senderId: message.senderId,
     chatId: message.chatId,
     text: message.text,
     isGroup: message.isGroup,
     chatType: message.isGroup ? 'group' : message.isChannel ? 'channel' : 'private'
   };
   ```
3. **Database Insert Node** (store in your preferred database)

## Event-Specific Handling

Handle different types of events:

```javascript
const event = $json;

switch (event._) {
  case 'updateNewMessage':
    return {
      type: 'new_message',
      messageId: event.messageId,
      text: event.text,
      senderId: event.senderId
    };
    
  case 'updateMessageEdited':
    return {
      type: 'message_edited',
      messageId: event.messageId,
      newText: event.text
    };
    
  case 'updateDeleteMessages':
    return {
      type: 'message_deleted',
      messageIds: event.messageIds
    };
    
  case 'updateChatAction':
    return {
      type: 'chat_action',
      action: event.action, // typing, uploading, etc.
      chatId: event.chatId
    };
    
  default:
    return {
      type: 'unknown',
      event: event
    };
}
```

## Error Handling

Add error handling to your workflows:

```javascript
try {
  const message = $json;
  
  // Your message processing logic here
  if (!message || !message.text) {
    throw new Error('Invalid message data');
  }
  
  return {
    success: true,
    data: message
  };
  
} catch (error) {
  return {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  };
}
```

## Rate Limiting

Implement rate limiting to avoid overwhelming APIs:

```javascript
// Store last execution time per chat
const chatId = $json.chatId;
const now = Date.now();
const lastExecution = $node["workflow"].data?.lastExecution || {};

if (lastExecution[chatId] && (now - lastExecution[chatId] < 5000)) {
  // Skip if less than 5 seconds since last message from this chat
  return null;
}

// Update last execution time
lastExecution[chatId] = now;
$node["workflow"].data = { lastExecution };

return $json;
```

## Security Considerations

Always validate and sanitize message content:

```javascript
const message = $json;

// Sanitize text content
const sanitizedText = message.text
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
  .replace(/[<>&"']/g, (char) => {
    const entityMap = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entityMap[char];
  });

return {
  ...message,
  text: sanitizedText,
  originalText: message.text
};
```
