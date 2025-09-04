import React, { useEffect, useState } from 'react'
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import { DialogType } from '@/lib/types/dialog_type';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { OrderDetailsSummary } from '@/lib/types/order_details_type';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface UserInfoProps {
    openDialog: DialogType,
    customerDetails: {
        name: string
        phoneNumber: string
    },
    handleOpen: (dialog: DialogType) => void,
    handleClose: () => void,
    handleDialogAction: <T extends Exclude<DialogType, null>>(data: OrderDetailsSummary<T>) => void
}
const UserInfo = ({ openDialog, customerDetails, handleOpen, handleClose, handleDialogAction }: UserInfoProps) => {
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const [name, setName] = useState<string>(customerDetails.name);
    const [phoneNumber, setPhoneNumber] = useState<string>(customerDetails.phoneNumber)
    useEffect(() => {
        if (customerDetails) {
            setName(customerDetails.name)
            setPhoneNumber(customerDetails.phoneNumber)
        }
    }, [customerDetails])

    const handleUserInfoSave = () => {
        handleDialogAction({
            type: "contact",
            payload: {
                name: name,
                phoneNumber: phoneNumber
            }
        });
    }
    return (
        <>
            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleOpen('contact')}>
                <div className="flex items-center gap-2">
                    <Person4OutlinedIcon className="text-orange-500" />
                    <div>
                        <p className="font-medium">{customerDetails.name}</p>
                        <p className="text-sm text-gray-600">{customerDetails.phoneNumber}</p>
                    </div>
                </div>
                <span ><ArrowForwardIosOutlinedIcon className="text-gray-400" /></span>
            </div>

            <Dialog
                open={openDialog === 'contact'}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                fullScreen={isMobile} // 👈 makes it full screen only on small devices
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: { xs: 2, sm: 3 },
                        pt: 2,
                    }}
                >
                    <Typography
                        component="div"
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Person4OutlinedIcon className="text-black mr-2" />
                        Your details
                    </Typography>
                    <IconButton edge="end" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" fontWeight={500} mb={1}>
                                First Name
                            </Typography>
                            <TextField
                                id="name"
                                placeholder="Enter your first name"
                                variant="outlined"
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                value={name}
                                required
                                InputProps={{
                                    sx: {
                                        borderRadius: '15px',
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight={500} mb={1}>
                                Phone Number
                            </Typography>
                            <TextField
                                id="phoneNumber"
                                placeholder="Enter your phone number"
                                variant="outlined"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                fullWidth
                                value={phoneNumber}
                                required
                                InputProps={{
                                    sx: {
                                        borderRadius: '15px',
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: { xs: 2, sm: 3 },
                        pb: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleUserInfoSave}
                        fullWidth
                        sx={{
                            backgroundColor: '#f36805',
                            color: 'white',
                            py: 1.5,
                            fontSize: '18px',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#f36805',
                            },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


        </>

    )
}

export default UserInfo
