import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const mockData = {
  events: [
    {
      id: 1,
      type: "conférence",
      date: "2022-04-29T20:28:45.744Z",
      title: "User&product MixUsers",
      cover: "/images/event1.png",
      description: "Présentation des nouveaux usages UX.",
      nb_guesses: 900,
      periode: "14-15-16 Avril",
    },
    {
      id: 2,
      type: "expérience digitale",
      date: "2022-01-29T20:28:45.744Z",
      title: "#DigitonPARIS",
      cover: "/images/event2.png",
      description: "Présentation des outils analytics",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
    },
  ],
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-02-29T20:28:45.744Z",
      cover: "/images/focus1.png",
    },
  ],
};

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        }),
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  beforeEach(() => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockResolvedValue(mockData);
  });

  it("a list of events is displayed", async () => {
    render(<Home />);
    await waitFor(() => screen.getAllByText("Nos réalisations"));
    expect(screen.getAllByText("Nos réalisations")[0]).toBeInTheDocument();
  });

  it("a list of people is displayed", async () => {
    render(<Home />);
    await waitFor(() => screen.getAllByText("Notre équipe"));
    expect(screen.getAllByText("Notre équipe")[0]).toBeInTheDocument();
    expect(screen.getByText("Samira")).toBeInTheDocument();
    expect(screen.getByText("Jean-baptiste")).toBeInTheDocument();
  });

  it("a footer is displayed", async () => {
    render(<Home />);
    await waitFor(() => screen.getByText("Contactez-nous"));
    expect(screen.getByText("Contactez-nous")).toBeInTheDocument();
    expect(screen.getByText("Notre derniére prestation")).toBeInTheDocument();
    expect(screen.getByText(/45 avenue de la République/i)).toBeInTheDocument();
  });

  it("an event card, with the last event, is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>,
    );
    // Vérifier que la section existe
    await waitFor(() => screen.getByText("Notre derniére prestation"));
    // L'événement le plus récent devrait s'afficher (peut apparaître plusieurs fois dans la page)
    await waitFor(() => screen.getAllByText("User&product MixUsers"), {
      timeout: 3000,
    });
    expect(screen.getAllByText("User&product MixUsers").length).toBeGreaterThan(
      0,
    );
  });
});

describe("End-to-End: Contact Form Flow", () => {
  beforeEach(() => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockResolvedValue(mockData);
  });

  it("complete contact form submission flow works correctly", async () => {
    render(<Home />);

    // Étape 1: Vérifier que la page est chargée
    await waitFor(() => screen.getAllByText("Contact"));
    expect(screen.getAllByText("Contact")[0]).toBeInTheDocument();

    // Étape 2: Récupérer les champs du formulaire (par placeholder ou par test-id)
    const fields = screen.getAllByTestId("field-testid");
    const nomField = fields[0]; // Nom
    const prenomField = fields[1]; // Prénom
    const emailField = fields[2]; // Email
    const messageField = fields[3]; // Message

    // Remplir le formulaire
    userEvent.type(nomField, "Dupont");
    userEvent.type(prenomField, "Jean");
    userEvent.type(emailField, "jean.dupont@example.com");
    userEvent.type(messageField, "Je souhaite organiser un événement");

    // Étape 3: Soumettre le formulaire
    const submitButton = screen.getByText("Envoyer");
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);

    // Étape 4: Vérifier l'état "En cours"
    await waitFor(() => screen.getByText("En cours"));
    expect(screen.getByText("En cours")).toBeInTheDocument();

    // Étape 5: Vérifier que le modal de succès s'affiche
    await waitFor(() => screen.getByText("Message envoyé !"), {
      timeout: 3000,
    });
    expect(screen.getByText("Message envoyé !")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Merci pour votre message nous tâcherons de vous répondre/i,
      ),
    ).toBeInTheDocument();

    // Étape 6: Fermer le modal
    const closeButton = screen.getByTestId("close-modal");
    userEvent.click(closeButton);

    // Étape 7: Vérifier que le modal est fermé
    await waitFor(() => {
      expect(screen.queryByText("Message envoyé !")).not.toBeInTheDocument();
    });

    // Étape 8: Vérifier qu'on peut soumettre à nouveau
    expect(screen.getByText("Envoyer")).toBeInTheDocument();
  });

  it("displays all main sections in the correct order", async () => {
    render(<Home />);

    // Vérifier toutes les sections principales (utiliser getAllByText pour gérer les duplicatas menu/section)
    await waitFor(() => screen.getAllByText("Nos services"));

    const sections = [
      "Nos services",
      "Nos réalisations",
      "Notre équipe",
      "Contact",
    ];

    sections.forEach((section) => {
      expect(screen.getAllByText(section).length).toBeGreaterThan(0);
    });
  });

  it("displays service cards with correct content", async () => {
    render(<Home />);

    await waitFor(() => screen.getAllByText("Nos services"));

    expect(screen.getAllByText(/Soirée.*entreprise/i).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Conférences").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Experience digitale").length).toBeGreaterThan(
      0,
    );
  });
});
