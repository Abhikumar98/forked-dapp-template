import { ethers } from 'ethers'
import abi from './abi.json'

export const contract = () => {
	const { ethereum } = window
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	if (ethereum) {
		const signer = provider.getSigner()
		const contractReader = new ethers.Contract('0x5fc8d32690cc91d4c39d9d3abcbd16989f875707', abi, signer)
		return contractReader
	}
}
