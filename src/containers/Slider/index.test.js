import { render, screen } from "@testing-library/react";
import Slider from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-02-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "World Gaming Day",
      description: "Evenement mondial autour du gaming",
      date: "2022-03-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "World Farming Day",
      description: "Evenement mondial autour de la ferme",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
  ],
};

describe("When slider is created", () => {
  it("a list card is displayed", async () => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Slider />
      </DataProvider>,
    );
    await screen.findByText("World Farming Day");
    await screen.findByText("janvier");
    await screen.findByText("Evenement mondial autour de la ferme");
  });

  describe("and events are sorted", () => {
    it("events are sorted from oldest to most recent", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Slider />
        </DataProvider>,
      );
      // Le premier événement affiché doit être le plus ancien (janvier)
      await screen.findByText("World Farming Day");
      expect(screen.getByText("World Farming Day")).toBeInTheDocument();
      expect(screen.getByText("janvier")).toBeInTheDocument();
    });
  });

  describe("and bullet points are displayed", () => {
    it("displays the correct number of bullet points", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Slider />
        </DataProvider>,
      );
      await screen.findByText("World Farming Day");
      // Il doit y avoir 3 bullet points pour 3 événements
      const radioButtons = screen.getAllByRole("radio");
      expect(radioButtons).toHaveLength(3);
    });

    it("the first bullet point is checked by default", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Slider />
        </DataProvider>,
      );
      await screen.findByText("World Farming Day");
      const radioButtons = screen.getAllByRole("radio");
      // Le premier bullet point (index 0) doit être checked
      expect(radioButtons[0]).toBeChecked();
      expect(radioButtons[1]).not.toBeChecked();
      expect(radioButtons[2]).not.toBeChecked();
    });
  });
});
