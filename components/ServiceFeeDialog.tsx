import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeliveryFeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ServiceFeeDialog({ open, onClose }: DeliveryFeeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="div">Service fee</Typography>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
         <Typography variant="body2" gutterBottom>
          This allows us to provide and keep improving our service (including customer care) and user experience (including continuing to widen the choice of partners available to you).
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

