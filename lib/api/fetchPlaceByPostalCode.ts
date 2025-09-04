// import { PostCodePlace } from "../types/location_type";

export const fetchPlaceByPostalCode = async (
    postalCode: string,
  )=> {
    try {
      if (postalCode.length === 5) {
        // Ensure 5 characters before calling API
        const response = await fetch(
          `https://api.zippopotam.us/de/${postalCode}`,
        );
        if (!response.ok) {
          throw new Error('Invalid postal code');
        }
        const data = await response.json();
        return data.places;
      }
    } catch (err: unknown) {
      console.log(err);
      return [] ;
    }
    return [];
  };