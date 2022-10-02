import react, { useState } from 'react'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

export type ModalDetails = {
	title: string
	message: string
	isOpen: boolean
	navLink?: string
}

type ModalProps = ModalDetails & {
	modalCleanUp: (data: ModalDetails) => void
}

const CommonModal: React.FC<ModalProps> = ({ title, message, isOpen, modalCleanUp, navLink = '/dashboard' }) => {
	const navigate = useNavigate()

	const handleOk = (title: string) => {
		modalCleanUp({ title: '', message: '', isOpen: false })
		if (title === 'Success' && navLink) {
			navigate(navLink)
		}
	}

	return	<Modal title={title} visible={isOpen} onOk={() => handleOk(title)} cancelButtonProps={{ style: { display: 'none' }}} onCancel={() => handleOk(title)}>
		<p>{message}</p>
	</Modal>
}

export default CommonModal