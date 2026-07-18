/* eslint-disable no-undef */
describe("724 Events - Tests E2E", () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit("/");
  });

  describe("Chargement de la page", () => {
    it("devrait charger la page d'accueil avec succès", () => {
      // Vérifier que l'URL est correcte
      cy.url().should("eq", "http://localhost:3000/");

      // Vérifier que le titre de la page existe
      cy.get("header").should("be.visible");
    });

    it("devrait afficher le menu de navigation", () => {
      cy.get("header nav").should("be.visible");
    });
  });

  describe("Navigation et sections", () => {
    it('devrait afficher la section "Nos services"', () => {
      // Attendre que la section soit visible
      cy.get(".ServicesContainer", { timeout: 10000 })
        .scrollIntoView()
        .should("be.visible");
      cy.contains("h2", "Nos services").should("be.visible");
      // Attendre que les ServiceCards soient chargées
      cy.get(".ServiceCard", { timeout: 10000 }).should(
        "have.length.at.least",
        3,
      );
      // Vérifier que les services sont affichés (sans être trop strict sur le texte exact)
      cy.get(".ServiceCard").eq(0).should("contain", "entreprise");
      cy.get(".ServiceCard").eq(1).should("contain", "Conférences");
      cy.get(".ServiceCard").eq(2).should("contain", "digitale");
    });

    it('devrait afficher la section "Nos réalisations"', () => {
      cy.contains("h2", "Nos réalisations").should("be.visible");
    });

    it('devrait afficher la section "Notre équipe"', () => {
      cy.contains("h2", "Notre équipe").should("be.visible");
      cy.contains("Samira").should("be.visible");
      cy.contains("Jean-baptiste").should("be.visible");
    });

    it("devrait naviguer vers la section Contact via le menu", () => {
      // Cliquer sur le bouton Contact dans le menu
      cy.contains("button", "Contact").click();

      // Vérifier que la section Contact est visible
      cy.contains("h2", "Contact").should("be.visible");
    });
  });

  describe("Slider", () => {
    it("devrait afficher le slider", () => {
      cy.get(".SliderContainer").should("be.visible");
    });

    it("devrait avoir des éléments de navigation du slider", () => {
      // Attendre que le slider charge
      cy.get(".SliderContainer").should("be.visible");

      // Vérifier la présence d'au moins une carte d'événement dans le slider
      cy.get(".SlideCard").should("exist");
      // Vérifier la pagination du slider
      cy.get(".SlideCard__pagination input[type='radio']").should("exist");
    });
  });

  describe("Formulaire de contact", () => {
    beforeEach(() => {
      // Scroller jusqu'au formulaire
      cy.get("#contact").scrollIntoView();
    });

    it("devrait afficher tous les champs du formulaire", () => {
      cy.contains("span", "Nom").should("be.visible");
      cy.contains("span", "Prénom").should("be.visible");
      cy.contains("span", "Email").should("be.visible");
      cy.contains("span", "Message").should("be.visible");
      cy.contains(".label", "Personel / Entreprise").should("be.visible");
    });

    it("devrait permettre de remplir le formulaire", () => {
      // Remplir le formulaire
      cy.contains(".inputField", "Nom").find("input").type("Dupont");

      cy.contains(".inputField", "Prénom").find("input").type("Jean");

      cy.contains(".inputField", "Email")
        .find("input")
        .type("jean.dupont@example.com");

      cy.contains(".inputField", "Message")
        .find("textarea")
        .type("Ceci est un message de test pour le formulaire de contact.");

      // Vérifier que les valeurs sont bien saisies
      cy.contains(".inputField", "Nom")
        .find("input")
        .should("have.value", "Dupont");
    });

    it("devrait soumettre le formulaire avec succès", () => {
      // Remplir le formulaire
      cy.contains(".inputField", "Nom").find("input").type("Dupont");

      cy.contains(".inputField", "Prénom").find("input").type("Jean");

      cy.contains(".inputField", "Email")
        .find("input")
        .type("jean.dupont@example.com");

      cy.contains(".inputField", "Message")
        .find("textarea")
        .type("Message de test");

      // Soumettre le formulaire (SUBMIT button est un input, pas un button)
      cy.get('input[type="submit"][value="Envoyer"]').click();

      // Vérifier le message de chargement
      cy.get('input[type="submit"][value="En cours"]').should("be.visible");

      // Vérifier le message de succès (avec un timeout pour attendre l'API mock)
      cy.contains("Message envoyé !", { timeout: 2000 }).should("be.visible");
    });
  });

  describe("Footer", () => {
    it("devrait afficher le footer avec les informations de contact", () => {
      // Scroller jusqu'au footer
      cy.get("footer").scrollIntoView();
      cy.get("footer").should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("devrait être responsive sur mobile", () => {
      // Tester sur une taille d'écran mobile
      cy.viewport("iphone-x");
      cy.get("header").should("be.visible");
      cy.contains("h2", "Nos services").should("be.visible");
    });

    it("devrait être responsive sur tablette", () => {
      cy.viewport("ipad-2");
      cy.get("header").should("be.visible");
      cy.contains("h2", "Nos services").should("be.visible");
    });
  });
});
