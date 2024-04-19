import React from 'react'
import ReactDom from 'react-dom'
import { IoClose } from "react-icons/io5";

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '40px 50px',
  width: '500px',
  height: '500px',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function UploadModal({ open, children, onClose }) {
  if (!open) return null

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div className='modal' style={MODAL_STYLES}>
        <IoClose className="svg" onClickCapture={onClose} />
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}