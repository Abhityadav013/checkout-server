'use client';

import { DialogPayloadMap, DialogType } from "@/lib/types/dialog_type";
import { DialogHandlers, OrderDetailsSummary } from "@/lib/types/order_details_type";


export const dialogHandlers: DialogHandlers = {
  contact: (payload) => {
    storeDialogDataInSession({
      type: 'contact',
      payload: payload,
    });
    return getDialogDataFromSession('contact');
  },
  address: (payload) => {
    storeDialogDataInSession({
      type: 'address',
      payload: payload,
    });
    return getDialogDataFromSession('address');
  },
  time: (payload) => {
    storeDialogDataInSession({
      type: 'time',
      payload: payload,
    });
    return getDialogDataFromSession('time');
  },
  notes: (payload) => {
    storeDialogDataInSession({
      type: 'notes',
      payload: payload,
    });
    return getDialogDataFromSession('notes');
  },
};

const storeDialogDataInSession = <T extends keyof DialogPayloadMap>(
  data: OrderDetailsSummary<T>
): void => {
  const dialogData = sessionStorage.getItem('dialogData');
  const dialogDataObj = dialogData ? JSON.parse(dialogData) : {}; // Fetch existing data or create a new object

  // Store the payload in the dialogData object
  dialogDataObj[data.type] = data.payload;

  // Save the updated dialogData object back to sessionStorage
  sessionStorage.setItem('dialogData', JSON.stringify(dialogDataObj));
};

export const getDialogDataFromSession = <T extends DialogType>(
  type: T
): DialogPayloadMap[keyof DialogPayloadMap] | null => {
  if (typeof window === 'undefined') {
    return null; // Return null if on the server-side
  }
  const dialogData = sessionStorage.getItem('dialogData');
  if (!dialogData) return null;

  const dialogDataObj: Partial<DialogPayloadMap> = JSON.parse(dialogData);

  // Return the payload of the specified dialog type or null if it doesn't exist
  if (type == null) return null;
  return dialogDataObj[type] ?? null;
};
