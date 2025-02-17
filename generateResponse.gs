function generateResponse(e) { 
    var userInput = e.parameters.message; 
    var responseType = e.parameters.responseType;
    var emailType = e?.commonEventObject?.formInputs?.emailType?.stringInputs?.value?.[0]?? responseType;
    var senderName = e.parameters.senderName; 
    var receiverName = e.parameters.receiverName; 
    var senderEmail = e.parameters.senderEmail; 
    var receiverEmail = e.parameters.receiverEmail; 
    var messageId = e.parameters.messageId; 
    
    var apiKey = ''; // Replace with your OpenAI API key 
    var apiUrl = 'https://api.openai.com/v1/chat/completions'; 
   
    var prompt = `Generate a ${emailType} response email to ${senderName} (${senderEmail}) from ${receiverName} (${receiverEmail}): ${userInput} Make sure square brackets wont be included like [Subject]`; 
    
    var payload = JSON.stringify({ 
        "model": "gpt-4o-mini", 
        "messages": [{"role": "user", "content": prompt}], 
        "max_tokens": 150 // Adjust the number of tokens for the response 
    }); 
    
    var options = { 
        "method": "POST", 
        "headers": { 
            "Authorization": "Bearer " + apiKey, 
            "Content-Type": "application/json" 
        }, 
        "payload": payload, 
        "muteHttpExceptions": true // Mute exceptions to handle errors gracefully 
    }; 
    
    var response = UrlFetchApp.fetch(apiUrl, options); 
    var responseCode = response.getResponseCode(); 
    var responseData = JSON.parse(response.getContentText()); 
    
    var cardHeader = CardService.newCardHeader() 
        .setTitle('Email Response Generator') 
        .setSubtitle('Generated Response'); 
    
    var messageSection = CardService.newCardSection();
    if (responseCode === 429) { 
        messageSection.addWidget(CardService.newTextParagraph() 
            .setText('Error: You have exceeded your quota. Please check your OpenAI plan and billing details.')); 
    } else if (responseCode !== 200) { 
        messageSection.addWidget(CardService.newTextParagraph() 
            .setText('Error: ' + responseData.error.message +emailType)); 
    } else { 
        var output = responseData.choices[0].message.content.trim(); 
        messageSection.addWidget(CardService.newTextParagraph().setText(`Response to <b>${senderName}</b>: <b>${output}</b>`)) // Display response in bold
            .addWidget(CardService.newTextButton() 
                .setText('Reply') 
                .setOnClickAction(CardService.newAction() 
                    .setFunctionName('replyEmail') 
                    .setParameters({ messageId: messageId, body: output }))) 
          
            ; // Add reply button 
    } 
    
    var card = CardService.newCardBuilder() 
        .setHeader(cardHeader) 
        .addSection(messageSection) 
        .build(); 
    
    return CardService.newActionResponseBuilder() 
        .setNavigation(CardService.newNavigation().pushCard(card)) 
        .build(); 
} 


