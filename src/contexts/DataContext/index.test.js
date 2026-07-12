import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

const mockEvents = {
  events: [
    {
      id: 1,
      title: "Event 1",
      date: "2022-01-01T00:00:00.000Z",
      cover: "/images/event1.png",
    },
    {
      id: 2,
      title: "Event 2",
      date: "2022-06-01T00:00:00.000Z",
      cover: "/images/event2.png",
    },
    {
      id: 3,
      title: "Event 3",
      date: "2022-12-01T00:00:00.000Z",
      cover: "/images/event3.png",
    },
  ],
  focus: [
    {
      title: "Focus Event",
      date: "2022-03-01T00:00:00.000Z",
    },
  ],
};

describe("When a data context is created", () => {
  beforeEach(() => {
    window.console.error = jest.fn();
  });

  it("a call is executed on the events.json file", async () => {
    api.loadData = jest.fn().mockReturnValue({ result: "ok" });
    const Component = () => {
      const { data } = useData();
      return <div>{data?.result}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>,
    );
    const dataDisplayed = await screen.findByText("ok");
    expect(dataDisplayed).toBeInTheDocument();
  });

  describe("and data is successfully loaded", () => {
    it("the data object contains events and focus", async () => {
      api.loadData = jest.fn().mockReturnValue(mockEvents);
      const Component = () => {
        const { data } = useData();
        return (
          <div>
            {data && (
              <>
                <div>Events: {data.events?.length}</div>
                <div>Focus: {data.focus?.length}</div>
              </>
            )}
          </div>
        );
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      expect(await screen.findByText("Events: 3")).toBeInTheDocument();
      expect(await screen.findByText("Focus: 1")).toBeInTheDocument();
    });

    it("the 'last' property returns the most recent event", async () => {
      api.loadData = jest.fn().mockReturnValue(mockEvents);
      const Component = () => {
        const { last } = useData();
        return <div>{last?.title}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      // L'événement le plus récent est "Event 3" (décembre 2022)
      const lastEvent = await screen.findByText("Event 3");
      expect(lastEvent).toBeInTheDocument();
    });

    it("the 'last' property is undefined when there are no events", async () => {
      api.loadData = jest.fn().mockReturnValue({ events: [] });
      const Component = () => {
        const { last } = useData();
        return <div>{last ? "has last" : "no last"}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      expect(await screen.findByText("no last")).toBeInTheDocument();
    });

    it("the 'last' property is undefined when events is null", async () => {
      api.loadData = jest.fn().mockReturnValue({ events: null });
      const Component = () => {
        const { last } = useData();
        return <div>{last ? "has last" : "no last"}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      expect(await screen.findByText("no last")).toBeInTheDocument();
    });
  });

  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      api.loadData = jest.fn().mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      const dataDisplayed = await screen.findByText("error on calling events");
      expect(dataDisplayed).toBeInTheDocument();
    });

    it("the data remains null when an error occurs", async () => {
      api.loadData = jest.fn().mockRejectedValue("network error");

      const Component = () => {
        const { data, error } = useData();
        return (
          <div>
            <div>Data: {data ? "loaded" : "null"}</div>
            <div>Error: {error ? "yes" : "no"}</div>
          </div>
        );
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      expect(await screen.findByText("Data: null")).toBeInTheDocument();
      expect(await screen.findByText("Error: yes")).toBeInTheDocument();
    });

    it("the last property is undefined when an error occurs", async () => {
      api.loadData = jest.fn().mockRejectedValue("error");

      const Component = () => {
        const { last } = useData();
        return <div>{last ? "has last" : "no last"}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>,
      );
      expect(await screen.findByText("no last")).toBeInTheDocument();
    });
  });
});
