import * as yup from 'yup'

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
export const BasicSchema = yup.object().shape({
	firstname:yup.string().min(3,'username must be at least 3 characters long').required('required'),
	lastname:yup.string().min(3,'username must be at least 3 characters long').required('required'),
	email: yup.string().email('Please enter a valid email').required('required'),
	// age: yup.number().positive().integer().required('required'),
	password: yup.string().min(5).matches(passwordRules, { message: 'Please create a stronger password' }).required('required'),
	// confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('required')
})
export const AdvancedSchema = yup.object().shape({
	username:yup.string().min(3,'username must be at least 3 characters long').required('required'),
	jobType:yup.string().oneOf(['designer','developer','manager','other'],''),
	acceptedTos:yup.boolean().oneOf([true],'Please accept the terms of service')
})