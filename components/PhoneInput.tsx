'use client'
import type React from "react"
import { Box, TextField, InputAdornment } from "@mui/material"
import { styled } from "@mui/material/styles"
import { getCountryCallingCode } from "react-phone-number-input/input"
import en from "react-phone-number-input/locale/en.json"
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js"
import { useEffect, useState } from "react"
import Image from "next/image"
import validator from 'validator';

// Custom styled components using MUI's styled API
const PhoneInputWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    width: "100%",
}))

interface PhoneInputProps {
    phoneNumber: string
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>,
    selectedCountry: CountryCode,

}
const PhoneInput: React.FC<PhoneInputProps> = ({ phoneNumber, setPhoneNumber, selectedCountry }) => {
    const [isValid, setIsValid] = useState<boolean | null>(null)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!phoneNumber) {
            setIsValid(null)
            setErrorMessage("")
            return
        }

        const fullNumber = `${getCallingCode(selectedCountry)}${phoneNumber}`

        try {
            // Use libphonenumber-js to validate the phone number

            const isValid = validator.isMobilePhone(fullNumber, 'de-DE')//isValidPhoneNumber(fullNumber, selectedCountry)
            setIsValid(isValid)

            // Get expected length for validation message
            const expectedLength = getExpectedLength(selectedCountry)

            if (!isValid) {
                const parsedNumber = parsePhoneNumberFromString(fullNumber, selectedCountry)
                if (!parsedNumber) {
                    setErrorMessage(`Invalid phone number format for ${en[selectedCountry]}`)
                } else if (phoneNumber.length < expectedLength) {
                    setErrorMessage(`Phone number too short (expected ${expectedLength} digits)`)
                } else if (phoneNumber.length > expectedLength) {
                    setErrorMessage(`Phone number too long (expected ${expectedLength} digits)`)
                } else {
                    setErrorMessage(`Invalid phone number for ${en[selectedCountry]}`)
                }
            } else {
                setErrorMessage("")
            }
        } catch (error) {
            setIsValid(false)
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
        }
    }, [phoneNumber, selectedCountry])
    // Get country calling code based on selected country
    const getCallingCode = (country: CountryCode) => {
        try {
            return `+${getCountryCallingCode(country)}`
        } catch (error) {
            if (error instanceof Error) {
                console.log(`error while fetching country code: ${error.message}`)
            } else {
                console.log("An unknown error occurred while fetching country code.")
            }
            return ""
        }
    }

    // Get flag URL for a country
    const getFlagUrl = (countryCode: string) => {
        return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
    }

    // Handle phone number input change
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, spaces, and some special characters
        const value = event.target.value.replace(/[^\d\s+()-]/g, "")

        // Get expected length for the selected country
        const expectedLength = getExpectedLength(selectedCountry)

        // Limit input to expected length + some buffer (for spaces, etc.)
        if (value.replace(/\D/g, "").length <= expectedLength + 3) {
            setPhoneNumber(value)
        }
    }
    const getExpectedLength = (country: CountryCode) => {
        // This is a simplified approach - actual phone number lengths vary
        // These are approximate common lengths without the country code
        const lengthMap: Record<string, number> = {
            DE: 10, // Germany: typically 10-11 digits
            US: 10, // USA: 10 digits
            GB: 10, // UK: typically 10 digits
            IN: 10, // India: typically 10 digits
            CN: 11, // China: typically 11 digits
            JP: 10, // Japan: typically 10 digits
            FR: 9, // France: typically 9 digits
            IT: 10, // Italy: typically 9-10 digits
            BR: 10, // Brazil: typically 10-11 digits
            RU: 10, // Russia: typically 10 digits
        }

        return lengthMap[country] || 10 // Default to 10 if not specified
    }

    return (
        <PhoneInputWrapper>
            <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                error={isValid === false}
                helperText={
                    <>
                        {isValid ? (
                            <Box component="span" display="flex" alignItems="center" justifyContent="flex-end" color="green" sx={{ gap: 0.5 }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Valid phone number
                            </Box>
                        ):
                         <Box component="span">{errorMessage}</Box>}
                    </>

                }
                inputProps={{ maxLength: 11 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" className="flex items-center">
                            <div className="w-8 h-6 mr-2 relative overflow-hidden">
                                <Image
                                    src={getFlagUrl(selectedCountry) || "/placeholder.svg"}
                                    alt={`${en[selectedCountry]} flag`}
                                    width={20}
                                    height={20}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <span className="text-gray-600">{getCallingCode(selectedCountry)}</span>
                        </InputAdornment>
                    )
                }}
            />
        </PhoneInputWrapper>
    )
}

export default PhoneInput
