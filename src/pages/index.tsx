import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import Transactor from '../utils/funds'
import useStaticJsonRPC from '../utils/useStaticJsonRPC'
import { contract } from '../utils/ethereum'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'
import { formatBytes32String } from 'ethers/lib/utils'

export const connectWallet = async () => {
	try {
		if (!window) {
			throw new Error('No window object')
		}

		const { ethereum } = window

		if (!ethereum) {
			alert('Get MetaMask!')
			return
		}

		/*
		 * Fancy method to request access to account.
		 */

		// let chainId = await ethereum.request({ method: "eth_chainId" });
		// console.log(chainId);
		// console.log("Connected to chain " + chainId);

		// // String, hex code of the chainId of the Rinkebey test network
		// const rinkebyChainId = "0x4";
		// if (chainId !== rinkebyChainId) {
		// 	alert("You are not connected to the Rinkeby Test Network!");
		// 	throw new Error(
		// 		"You are not connected to the Rinkeby Test Network!"
		// 	);
		// }

		const accounts = await ethereum.request({
			method: 'eth_requestAccounts',
		})

		/*
		 * Boom! This should print out public address once we authorize Metamask.
		 */
		console.log({ accounts })
		console.log('Connected', accounts[0])

		return accounts[0]
	} catch (error) {
		console.log(error)
	}
}

const localRpcUrl = process.env.REACT_APP_CODESPACES
	? `https://${window.location.hostname.replace('3000', '8545')}`
	: 'http://' + (global.window ? window.location.hostname : 'localhost') + ':8545'

const Read = () => {
	const [address, setAddress] = useState('')
	const [result, setResult] = useState('')
	const localProvider = useStaticJsonRPC()

	console.log({ localProvider })

	const readState = async () => {
		console.log('reading state')
		const reader = await contract().purpose()
		console.log(reader)
	}

	const writeState = async () => {
		const random = Math.random().toString()
		const reader = await contract().setPurpose(random)
		await reader.wait()

		await readState()
	}

	const handleVerification = async () => {
		let leaves = addresses.map(addr => keccak256(addr))

		// Create tree
		let merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true })

		let hashedAddress = keccak256(address)
		const buf2hex = x => '0x' + x.toString('hex')
		let proof = merkleTree.getProof(hashedAddress).map(x => buf2hex(x.data))
		console.log({ proof })
		// ethers.utils.
		// console.log(formatBytes32String(proof))
		const reader = await contract().checkValidity(proof)
		await reader.wait()

		console.log({ reader })
	}

	useEffect(() => {
		// readState()
	}, [])

	const faucetTx = Transactor(localProvider)

	const addresses = ['0xAD6561E9e306C923512B4ea7af902994BEbd99B8', '0x631046bc261e0b2e3db480b87d2b7033d9720c90']

	const encryptAddress = () => {
		let leaves = addresses.map(addr => keccak256(addr))

		// Create tree
		let merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true })
		// Get root
		let rootHash = `0x${merkleTree.getRoot().toString('hex')}`

		// Pretty-print tree
		console.log(merkleTree.toString())
		console.log({ rootHash })

		let address = addresses[0]
		let hashedAddress = keccak256(address)

		let proof = merkleTree.getHexProof(hashedAddress)
		console.log(proof)

		// Check proof
		let v = merkleTree.verify(proof, hashedAddress, rootHash)
		console.log(v) // returns true
	}

	return (
		<>
			{/* <div onClick={writeState}>Read</div> */}
			<button
				onClick={() => {
					console.log('hello')
					faucetTx({
						to: '0xF2AA5E0835A6105B4917076ea178520a99EEF903',
						value: ethers.utils.parseEther('1'),
					})
				}}
			>
				Funds plis
			</button>
			<button onClick={connectWallet}>Connect</button>
			<div className="m-4">
				<input value={address} onChange={e => setAddress(e.target.value)} />
			</div>
			<div className="m-4">
				<button onClick={handleVerification}>Verify</button>
			</div>
			<div>
				<pre>{result}</pre>
			</div>
			<div className="m-4">
				<button onClick={encryptAddress}>Verify Address</button>
			</div>
		</>
	)
}

export default Read
