function autoEmailScript(e) { 
    return createAutoCard(e); 
}

function createAutoCard(e) { 
    var cardHeader = CardService.newCardHeader() 
        .setTitle('Email Response Generator') 
        .setSubtitle(''); 
    var messageSection = CardService.newCardSection();  

    if (e && e.gmail && e.gmail.messageId) { 
        var messageId = e.gmail.messageId; 
        var thread = GmailApp.getMessageById(messageId).getThread();
        var messages = thread.getMessages();
        
        var senderName, receiverName;
        var senderEmail, receiverEmail;
        var fullEmailBody = '';
        
        // Initialize variables to track the last received and sent messages
        var lastReceivedMessage = null;
        var lastSentMessage = null;

        // Loop through messages to identify the sender, receiver, and collect the full email body
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            fullEmailBody += message.getPlainBody() + '\n';

            // Identify sender and receiver from the first non-sent message
            if (senderName === undefined && message.getFrom().indexOf(Session.getActiveUser().getEmail()) === -1) {
                senderName = message.getFrom();
                var senderMatch = message.getFrom().match(/<([^>]+)>/);
                senderEmail = senderMatch ? senderMatch[1] : message.getFrom();

                receiverName = message.getTo();
                var receiverMatch = message.getTo().match(/<([^>]+)>/);
                receiverEmail = receiverMatch ? receiverMatch[1] : message.getTo();
            }

            // Identify the last received and sent messages
            if (message.getFrom().indexOf(Session.getActiveUser().getEmail()) === -1) {
                lastReceivedMessage = message;
            } else {
                lastSentMessage = message;
            }
        }

        // Fallback values if sender/receiver names and emails are not identified
        senderName = senderName || "Unknown Sender";
        receiverName = receiverName || "Unknown Receiver";
        senderEmail = senderEmail || "unknown@example.com";
        receiverEmail = receiverEmail || "unknown@example.com";

        // Function to clean email body (e.g., remove quoted text)
       
        function cleanEmailBody(body) {
            return body.replace(/^>.*$/gm, '').trim();
        }


        // Add action buttons for generating responses
        messageSection.addWidget(CardService.newTextButton() 
            .setText('Generate Affirmative Response') 
            .setOnClickAction(CardService.newAction() 
                .setFunctionName('generateResponse') 
                .setParameters({message: fullEmailBody, senderName: senderName, receiverName: receiverName, senderEmail: senderEmail, receiverEmail: receiverEmail, messageId: messageId, responseType: 'affirmative' })))
            
            .addWidget(CardService.newTextButton() 
            .setText('Generate Decline Response') 
            .setOnClickAction(CardService.newAction() 
                .setFunctionName('generateResponse') 
                .setParameters({message: fullEmailBody, senderName: senderName, receiverName: receiverName, senderEmail: senderEmail, receiverEmail: receiverEmail, messageId: messageId, responseType: 'decline' })))

            .addWidget(CardService.newTextButton() 
            .setText('Generate Neutral Response') 
            .setOnClickAction(CardService.newAction() 
                .setFunctionName('generateResponse') 
                .setParameters({message: fullEmailBody, senderName: senderName, receiverName: receiverName, senderEmail: senderEmail, receiverEmail: receiverEmail, messageId: messageId, responseType: 'neutral or unsure' })));
    } else { 
        messageSection.addWidget(CardService.newTextParagraph().setText('No email content available.')); 
    }
    // Display last received message details
    if (lastReceivedMessage) {
        messageSection.addWidget(CardService.newTextParagraph().setText(
            "Last Received Email:\n" +
            "Subject: " + lastReceivedMessage.getSubject() + "\n" +
            "Date: " + lastReceivedMessage.getDate() + "\n" +
            "From: " + lastReceivedMessage.getFrom() + "\n" +
         
            "Body: " + cleanEmailBody(lastReceivedMessage.getPlainBody())
        ));
    } else {
        messageSection.addWidget(CardService.newTextParagraph().setText("No received emails found."));
    }

    // Display last sent message details
    if (lastSentMessage) {
        messageSection.addWidget(CardService.newTextParagraph().setText(
            "Last Sent Email:\n" +
            "Subject: " + lastSentMessage.getSubject() + "\n" +
            "Date: " + lastSentMessage.getDate() + "\n" +
            "From: " + lastSentMessage.getFrom() + "\n" +
          
            "Body: " + cleanEmailBody(lastSentMessage.getPlainBody())
        ));
    } else {
        messageSection.addWidget(CardService.newTextParagraph().setText("No sent emails found."));
    }
    var card = CardService.newCardBuilder() 
        .setHeader(cardHeader) 
        .addSection(messageSection) 
        .build(); 

    return card; 
}
