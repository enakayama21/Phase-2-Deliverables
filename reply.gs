function replyEmail(e) { 
    var messageId = e.parameters.messageId; 
    var body = e.parameters.body; 
    var message = GmailApp.getMessageById(messageId); 
    
    if (body) { 
        message.reply(body); 
    } else { 
        message.reply("Your reply message here"); 
    } 
    
    var cardHeader = CardService.newCardHeader() 
        .setTitle('Email Response Generator') 
        .setSubtitle('Reply Sent'); 
    
    var messageSection = CardService.newCardSection() 
        .addWidget(CardService.newTextParagraph().setText(`Your reply has been sent.`)); 
    
    var card = CardService.newCardBuilder() 
        .setHeader(cardHeader) 
        .addSection(messageSection) 
        .build(); 
    
    return CardService.newActionResponseBuilder() 
        .setNavigation(CardService.newNavigation().pushCard(card)) 
        .build(); 
} 
