import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPrice } from '@/utils/valuesInEuro';

interface MinimumOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onShopMore: () => void;
  currentAmount: number;
}

export default function MinimumOrderDialog({
  open,
  onClose,
  onShopMore,
  currentAmount,
}: MinimumOrderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="div" fontWeight="bold" fontSize="1.2rem">
          🚧 Almost There!
        </Typography>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <ShoppingCartIcon fontSize="large" color="action" />
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Your cart is at <strong>{formatPrice(Number(currentAmount))}</strong>
          </Typography>
          <Typography variant="body1">
            You need just a bit more to reach the <strong>10,00 €</strong> minimum for delivery.  
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hungry for more? Add something tasty and we’ll be on our way! 🚀
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onShopMore}
            sx={{ mt: 1, px: 4,backgroundColor:'#FF6347' }}
          >
            🛒 Keep Browsing
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
