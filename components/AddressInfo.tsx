import React, { useEffect } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { DialogType } from "@/lib/types/dialog_type";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { OrderDetailsSummary } from "@/lib/types/order_details_type";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchPlaceByPostalCode } from "@/lib/api/fetchPlaceByPostalCode";
import { fetchStreetsByPostalCode } from "@/lib/api/fetchStreetsByPostalCode";
import { ErrorResponse } from "@/lib/types/error_type";
import dynamic from "next/dynamic";
import Image from "next/image";
import { PostCodePlace } from "@/lib/types/location_type";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const RestaurantMap = dynamic(() => import("@/components/RestaurantMap"), {
  ssr: false,
});
interface AddressInfoProps {
  isPickup: boolean;
  openDialog: DialogType;
  customerAddress: {
    pincode: string;
    buildingNumber: string;
    street: string;
    town: string;
  };
  handleOpen: (dialog: DialogType) => void;
  handleClose: () => void;
  handleDialogAction: <T extends Exclude<DialogType, null>>(
    data: OrderDetailsSummary<T>
  ) => void;
}
const AddressInfo = ({
  isPickup,
  openDialog,
  customerAddress,
  handleOpen,
  handleClose,
  handleDialogAction,
}: AddressInfoProps) => {
  const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
  const [buildingNumber, setBuildingNumber] = React.useState("");
  const [street, setStreet] = React.useState<string>("");
  const [town, setTown] = React.useState<string>("");
  const [pincode, setPincode] = React.useState<string>("");
  const [currentFormError, setCurrentFormError] = React.useState<ErrorResponse>(
    []
  );
  const [streetOptions, setStreetOptions] = React.useState<string[]>([]);
  useEffect(() => {
    if (customerAddress) {
      setStreet(customerAddress.street);
      setTown(customerAddress.town);
      setPincode(customerAddress.pincode);
      setBuildingNumber(customerAddress.buildingNumber);
    }
  }, [customerAddress]);

  const handleUserInfoSave = () => {
    handleDialogAction({
      type: "address",
      payload: {
        buildingNumber: buildingNumber,
        street: street,
        town: town,
        pincode: pincode,
      },
    });
  };

  const handlePostalCodeChange = async (value: string): Promise<void> => {
    setPincode(value);
    if (value.length === 5) {
      const pinCodeArea: PostCodePlace[] = await fetchPlaceByPostalCode(value); // Fetch place and streets when postal code is complete
      if (pinCodeArea && pinCodeArea.length > 0) {
        //             setTown(formValues.customerDetails.address.town || "");
        setTown(pinCodeArea[0]["place name"] || "");
        const streets = await fetchStreetsByPostalCode(value);
        setStreetOptions(streets);
        setCurrentFormError((prev) =>
          prev.filter((error) => error.key !== "pincode")
        );
      } else {
        setTown("");
        setStreetOptions([]);
        setCurrentFormError([
          {
            key: "pincode",
            message: "Invalid pincode. Please enter correct pincode",
          },
        ]);
      }
    } else {
      setTown("");
      setStreet("");
      setBuildingNumber("");
    }
  };

  const getErrorMessage = (key: string) => {
    if (currentFormError && currentFormError.length === 0) {
      return null;
    } else {
      return currentFormError?.find((err) => err.key === key)?.message || null;
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 rounded cursor-pointer"
        onClick={() => handleOpen("address")}
      >
        <div className="flex items-center gap-2">
          <LocationOnOutlinedIcon className="text-orange-500" />
          <div>
            <p className="font-medium">
              {customerAddress.street} {customerAddress.buildingNumber}
            </p>
            <p className="text-sm text-gray-600">
              {customerAddress.pincode}, {customerAddress.town}
            </p>
          </div>
        </div>
        <span>
          <ArrowForwardIosOutlinedIcon className="text-gray-400" />
        </span>
      </div>
      <Dialog
        open={openDialog === "address"}
        onClose={handleClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "700px",
            maxWidth: "100vw", // so it’s responsive
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="div"
            variant="h6"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <LocationOnOutlinedIcon className="text-black" />
            Edit address
          </Typography>
          <IconButton edge="end" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className="w-full max-w-[1040px] px-4 md:px-6 py-4 md:py-6 mx-auto">
            {isPickup ? (
              <>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={3}
                  mb={4}
                >
                  <Box flexShrink={0} display="flex" justifyContent="center">
                    <Image
                      src="https://testing.indiantadka.eu/assets/restaurant.png"
                      alt="Indian Tadka"
                      width={60}
                      height={60}
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                        height: "100%",
                        width: "auto",
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Indian Tadka
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {customerAddress.street}, {customerAddress.buildingNumber}{" "}
                      {customerAddress.pincode}, {customerAddress.town}
                    </Typography>
                  </Box>
                </Box>
                <RestaurantMap />
              </>
            ) : (
              <>
                {/* Pin Code and Building Number */}
                <Box
                  className="mb-4"
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  <div className="flex-1">
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pin code
                    </label>
                    <TextField
                      id="pincode"
                      placeholder="Type pin code"
                      variant="outlined"
                      onChange={(e) => handlePostalCodeChange(e.target.value)}
                      fullWidth
                      value={pincode}
                      required
                      error={!!getErrorMessage("pincode")}
                      helperText={getErrorMessage("pincode")}
                      InputProps={{ sx: { borderRadius: "15px" } }}
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="buildingNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      House Number
                    </label>
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={buildingNumber}
                      onChange={(e) => setBuildingNumber(e.target.value)}
                      required
                      sx={{ mb: 1 }}
                      slotProps={{
                        input: {
                          readOnly: pincode.length < 5,
                          sx: { borderRadius: "15px" },
                        },
                      }}
                      error={!!getErrorMessage("buildingNumber")}
                      helperText={getErrorMessage("buildingNumber")}
                    />
                  </div>
                </Box>

                {/* Street and Town */}
                <Box
                  className="mb-4"
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  <div className="flex-1">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Street Name
                    </label>
                    <Autocomplete
                      freeSolo
                      options={streetOptions}
                      inputValue={street}
                      onInputChange={(event, newInputValue) =>
                        setStreet(newInputValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Type street name"
                          variant="outlined"
                          fullWidth
                          required
                          inputProps={{
                            ...params.inputProps,
                            readOnly: pincode.length < 5,
                          }}
                          error={!!getErrorMessage("street")}
                          helperText={getErrorMessage("street")}
                          sx={{
                            mb: 1,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "15px !important",
                            },
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="town"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Town
                    </label>
                    <TextField
                      placeholder="Type your city or town"
                      variant="outlined"
                      fullWidth
                      required
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      sx={{ mb: 1 }}
                      error={!!getErrorMessage("town")}
                      helperText={getErrorMessage("town")}
                      slotProps={{
                        input: {
                          readOnly: pincode.length < 5,
                          sx: { borderRadius: "15px" },
                        },
                      }}
                    />
                  </div>
                </Box>
              </>
            )}
          </div>
        </DialogContent>

        {!isPickup && (
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleUserInfoSave}
              sx={{
                width: { xs: "100%", sm: "80%" },
                backgroundColor: "#f36805",
                color: "white",
                py: 1.5,
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#f36805" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default AddressInfo;
