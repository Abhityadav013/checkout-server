import React, { useEffect, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DialogType } from '@/lib/types/dialog_type';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { OrderDetailsSummary } from '@/lib/types/order_details_type';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
interface DeliveryTimeProps {
    isPickup: boolean,
    openDialog: DialogType,
    initialTime?: 'asap' | string;
    handleOpen: (dialog: DialogType) => void,
    handleClose: () => void,
    handleDialogAction: <T extends Exclude<DialogType, null>>(data: OrderDetailsSummary<T>) => void
}
const DeliveryTime = ({ isPickup, openDialog, initialTime, handleOpen, handleClose, handleDialogAction }: DeliveryTimeProps) => {
    const [selectedOption, setSelectedOption] = useState('asap');
    const [scheduledTime, setScheduledTime] = useState('');
    const [timeOptions, setTimeOptions] = useState<string[]>([]);
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);

    useEffect(() => {

        if (initialTime) {
            const isAsap: boolean = initialTime === 'asap';
            if (isAsap) {
                setSelectedOption('asap');
            } else {
                setSelectedOption('schedule');
                setScheduledTime(initialTime);
            }
        } else if (isPickup) {
            // For pickup with empty time, default to schedule
            setSelectedOption('schedule');
        }
    }, [initialTime, isPickup]);

    useEffect(() => {
        const currentTime = new Date();
        const timeOptions = [];

        const nextTime = new Date(currentTime);
        nextTime.setMinutes(Math.ceil(currentTime.getMinutes() / 5) * 5);
        nextTime.setSeconds(0);
        nextTime.setMilliseconds(0);

        const totalSlots = (2 * 60) / 5;

        for (let i = 0; i < totalSlots; i++) {
            const slotTime = new Date(nextTime.getTime() + i * 5 * 60 * 1000);
            const day = slotTime.toLocaleDateString('en-US', { weekday: 'long' });
            const hour = slotTime.getHours().toString().padStart(2, '0');
            const minute = slotTime.getMinutes().toString().padStart(2, '0');
            timeOptions.push(`${day} ${hour}:${minute}`);
        }

        setTimeOptions(timeOptions);
        //setScheduledTime(timeOptions[0]);
    }, []);

    const handleOptionChange = (e: { target: { value: string } }) => {
        setSelectedOption(e.target.value);
    };

    const handleTimeChange = (e: { target: { value: string } }) => {
        setScheduledTime(e.target.value);
    };

    const handleSave = () => {
        const isAsap = selectedOption === 'asap';
        handleDialogAction({
            type: "time",
            payload: {
                asap: isAsap,
                scheduledTime: isAsap ? '' : scheduledTime
            }
        });
    };
    return (
        <>
            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleOpen('time')}>
                <div className="flex items-center gap-2">
                    <AccessTimeIcon className="text-orange-500" />
                    <div>
                        {selectedOption === 'asap' ? (
                            <div>
                                <p className="font-medium">
                                    Deliver As Soon As Possible
                                </p>
                            </div>
                        ) : scheduledTime ? (
                            <div>
                                <p className="font-medium">
                                    {isPickup ? 'Collection scheduled' : 'Delivery scheduled'}
                                </p>
                                <p className="text-sm text-gray-600">{scheduledTime}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-medium">
                                    {isPickup ? 'Choose a collection time' : 'Choose a delivery time'}
                                </p>
                            </div>
                        )}
                    </div>


                </div>
                <span><ArrowForwardIosOutlinedIcon className="text-gray-400" /></span>
            </div>

            <Dialog
                open={openDialog === 'time'}
                onClose={handleClose}
                fullWidth
                maxWidth="sm" // limit size on larger screens
                fullScreen={isMobile} // make fullscreen on small screens
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: isMobile ? 2 : 4,
                        pt: isMobile ? 2 : 3,
                    }}
                >
                    <Typography
                        component="div"
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: 'flex', alignItems: 'center', fontSize: isMobile ? '1rem' : '1.25rem' }}
                    >
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        {isPickup ? 'Collection time' : 'Delivery time'}
                    </Typography>
                    <IconButton edge="end" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: isMobile ? 2 : 4 }}>
                    <div className="w-full p-0 sm:p-4">
                        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                            {isPickup ? (
                                <FormControlLabel
                                    value="schedule"
                                    control={<Radio sx={{ color: '#f36805', '&.Mui-checked': { color: '#f36805' } }} />}
                                    label="Schedule as collection time"
                                    sx={{ padding: '8px 16px', backgroundColor: '#f5f5f5', borderRadius: 2 }}
                                />
                            ) : (
                                <>
                                    <FormControlLabel
                                        value="asap"
                                        control={<Radio sx={{ color: '#f36805', '&.Mui-checked': { color: '#f36805' } }} />}
                                        label="As soon as possible"
                                        sx={{
                                            padding: '8px 16px',
                                            marginBottom: '8px',
                                            backgroundColor: selectedOption === 'asap' ? '#f5f5f5' : 'transparent',
                                            borderRadius: 2,
                                        }}
                                    />
                                    <Divider sx={{ my: 1 }} />
                                    <FormControlLabel
                                        value="schedule"
                                        control={<Radio sx={{ color: '#f36805', '&.Mui-checked': { color: '#f36805' } }} />}
                                        label="Schedule for later"
                                        sx={{
                                            padding: '8px 16px',
                                            backgroundColor: selectedOption === 'schedule' ? '#f5f5f5' : 'transparent',
                                            borderRadius: 2,
                                        }}
                                    />
                                </>
                            )}
                        </RadioGroup>

                        {selectedOption === 'schedule' && (
                            <TextField
                                select
                                value={scheduledTime}
                                onChange={handleTimeChange}
                                fullWidth
                                margin="normal"
                                helperText="Select or type a time within the next 2 hours"
                                sx={{
                                    marginBottom: 1,
                                    '& .MuiInputBase-root': { borderRadius: '15px' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        '&.Mui-focused fieldset': { borderColor: '#9e9e9e' },
                                    },
                                }}
                            >
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </div>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', px: isMobile ? 2 : 4, pb: isMobile ? 2 : 3 }}>
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            backgroundColor: '#f36805',
                            color: 'white',
                            padding: isMobile ? '8px 16px' : '10px 24px',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#f36805' },
                        }}
                        onClick={handleSave}
                        disabled={selectedOption === 'schedule' && !scheduledTime}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );

};

export default DeliveryTime;
