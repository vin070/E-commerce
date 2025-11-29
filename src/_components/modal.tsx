import { useEffect, type CSSProperties, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import './modal.css'

interface ModalProp extends PropsWithChildren {
    container: any,
    heading: string,
    cancelCallback: Function,
    submitCallback: Function,
    style: CSSProperties
}

function Modal({ children, container, heading, cancelCallback, submitCallback, style }: ModalProp) {

    useEffect(() => {
        const close = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") {
                cancelCallback()
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [])

    const modalContainer = (
        <div className='modal-container' style={style}>
            <div className='header'>
                <h2>{heading}</h2>
                <img onClick={() => cancelCallback()} src="src/_assets/svg/close.svg" alt="Close" />
            </div>
            {children}
            <div className='footer'>
                <button className="btn-cancel" onClick={() => cancelCallback()}>Cancel</button>
                <button className="btn-success" type='submit' onClick={() => submitCallback()} >Submit</button>
            </div>
        </div>
    )

    return (
        <>
            {createPortal(
                modalContainer,
                container
            )}
        </>
    )
}

export default Modal;