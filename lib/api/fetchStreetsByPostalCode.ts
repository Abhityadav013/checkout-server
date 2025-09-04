import { RoadElementsResponse } from "../types/address_street";


export const fetchStreetsByPostalCode = async (
    postalCode: string,
  ): Promise<string[]> => {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];area["postal_code"=${postalCode}]->.searchArea;way(area.searchArea)["highway"]["name"];out%20tags;`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const { elements }: RoadElementsResponse = data;
      if (elements && elements.length > 0) {
        const streetName = elements
          .map((item) => item.tags.name)
          .filter((name) => name);
        const res = [
          ...new Set(
            streetName.filter((name): name is string => name !== undefined),
          ),
        ];
        return res;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  };