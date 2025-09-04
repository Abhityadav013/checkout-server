import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BasketItem } from "@/lib/types/basket";
import { SpicyLevel } from "@/lib/types/enums";
import { UpdateCustomization } from "@/hooks/useCartActions";
import { GetCartData } from "@/lib/types/cart_data.type";

interface CartCustomizeDrawerProps {
  open: boolean;
  item: BasketItem | null;
  spicyFoodItem: string[];
  onClose: () => void;
  onSaveCustomization: (
    itemId: string,
    customization: UpdateCustomization
  ) => Promise<GetCartData>;
}

const EXTRA_OPTIONS = [
  "Extra rice",
  "Extra chutney",
  "No onions",
  "More masala",
];

const SPICY_LEVELS = [
  { label: "No Spicy", value: SpicyLevel.NO_SPICY },
  { label: "Spicy", value: SpicyLevel.SPICY },
  { label: "Very Spicy", value: SpicyLevel.VERY_SPICY },
];

const CartCustomizeDrawer: React.FC<CartCustomizeDrawerProps> = ({
  open,
  item,
  spicyFoodItem,
  onClose,
  onSaveCustomization,
}) => {
  const [customNotes, setCustomNotes] = useState("");
  const [extraOptions, setExtraOptions] = useState<string[]>([]);
  const [spicyLevel, setSpicyLevel] = useState<SpicyLevel>(SpicyLevel.NO_SPICY);

  useEffect(() => {
    if (item) {
      setCustomNotes(item.customization?.notes || "");
      setExtraOptions(item.customization?.options || []);
      const spicy = item.customization?.spicyLevel;
      switch (spicy) {
        case "no_spicy":
        case SpicyLevel.NO_SPICY:
          setSpicyLevel(SpicyLevel.NO_SPICY);
          break;
        case "spicy":
        case SpicyLevel.SPICY:
          setSpicyLevel(SpicyLevel.SPICY);
          break;
        case "very_spicy":
        case SpicyLevel.VERY_SPICY:
          setSpicyLevel(SpicyLevel.VERY_SPICY);
          break;
        default:
          setSpicyLevel(SpicyLevel.NO_SPICY);
      }
    }
  }, [item]);

  const handleOptionChange = (option: string) => {
    setExtraOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSave = () => {
    if (!item) return;
    onSaveCustomization(item.itemId, {
      notes: customNotes,
      options: extraOptions,
      spicyLevel,
    });
    onClose();
  };
  const isSpicyFood = spicyFoodItem.includes(item?.itemId || "");

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 320 } } }}
    >
      <Box
        sx={{
          p: 3,
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600} mb={2} mt={1}>
          {item?.itemName || "Customize Item"}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" fontWeight={500} mb={1}>
          Add a Note
        </Typography>
        <TextField
  multiline
  fullWidth
  minRows={3}
  placeholder="e.g. Make it less oily"
  value={customNotes}
  onChange={(e) => setCustomNotes(e.target.value)}
  sx={{
    "& .MuiInputBase-inputMultiline": {
      height: "72px",        // ~3 rows
      maxHeight: "72px",     // lock it to 3 rows
      overflowY: "auto",
      resize: "none",

      // Cute scrollbar styles
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#90caf9",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#42a5f5",
      },
    },
  }}
/>


        <Typography variant="subtitle1" fontWeight={500} mb={1}>
          Extra Options
        </Typography>
        <FormGroup sx={{ mb: 2 }}>
          {EXTRA_OPTIONS.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={extraOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
        {isSpicyFood && (
          <>
            <Typography variant="subtitle1" fontWeight={500} mb={1}>
              Spicy Level
            </Typography>
            <RadioGroup
              value={spicyLevel}
              onChange={(e) => setSpicyLevel(e.target.value as SpicyLevel)}
              sx={{ mb: 3 }}
            >
              {SPICY_LEVELS.map((level) => (
                <FormControlLabel
                  key={level.value}
                  value={level.value}
                  control={<Radio />}
                  label={level.label}
                />
              ))}
            </RadioGroup>
          </>
        )}

        <Box sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSave}
            sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
            disabled={!item}
          >
            Save Customization
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartCustomizeDrawer;
