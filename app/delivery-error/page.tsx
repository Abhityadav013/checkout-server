import EnhancedDeliveryError from "@/components/EnhancedDeliveryError";
import { getCutomerDeliveryDetails } from "../page";



export default async function DeliveryError() {
  const customerDelivery = await getCutomerDeliveryDetails()
  return <EnhancedDeliveryError  customerDelivery={customerDelivery}/>;
}
