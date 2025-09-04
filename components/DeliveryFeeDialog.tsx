import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeliveryFeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DeliveryFeeDialog({ open, onClose }: DeliveryFeeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="div">🚚 Delivery Fee</Typography>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          This contributes to the costs of delivery to you. It can vary depending on factors such as your distance from the store, selected store, order value, and sometimes time of day.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          <strong>Minimum order value for this place is €10.00</strong>
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          <strong>Delivery is free for orders over €65, regardless of distance.</strong>
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 1, boxShadow: 'none' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell><strong>Distance</strong></TableCell>
                <TableCell><strong>Delivery Fee</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Up to 3 km</TableCell>
                <TableCell>Free</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3 km to 4 km</TableCell>
                <TableCell>€1.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Each additional km beyond 4 km</TableCell>
                <TableCell>€0.50 per km</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
          * Delivery fees exclude offers, service fees, and other charges.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
