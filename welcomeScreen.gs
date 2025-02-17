function showWelcomeScreen(e) {
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle('Welcome to My Add-on'))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText('Select an option below:'))
      .addWidget(CardService.newTextButton().setText('Automatic Reply Generator').setOnClickAction(CardService.newAction().setFunctionName('autoEmailScript')))
      .addWidget(CardService.newTextButton().setText('Manual Reply Generator').setOnClickAction(CardService.newAction().setFunctionName('manualEmailScript'))))
      
    .build();

  return CardService.newUniversalActionResponseBuilder().displayAddOnCards([card]).build();
}

function checkAuthorization() {
  return CardService.newUniversalActionResponseBuilder().build();
}
