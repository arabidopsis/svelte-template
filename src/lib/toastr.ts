import { Notyf } from 'notyf';
import type { NotyfNotification } from 'notyf'
import 'notyf/notyf.min.css';

const notyf = new Notyf({
    position: { x: 'right', y: 'top' },
    types: [{
        type: 'success',
        icon: {
            className: 'fas fa-check',
            tagName: 'i', color: 'var(--bs-light)'
        },
        background: 'var(--bs-success)'
    },
    {
        type: 'error',
        icon: {
            className: "fas fa-bomb",
            tagName: 'i', color: 'var(--bs-light)'
        },
        background: 'var(--bs-danger)'
    },
    {
        type: 'info',
        icon: {
            className: 'fas fa-info-circle',
            tagName: 'i', color: 'var(--bs-light)'
        },
        background: 'var(--bs-info)'
    },
    {
        type: 'warning',
        icon: {
            className: "fas fa-exclamation-triangle",
            tagName: 'i', color: 'var(--bs-light)'
        },
        background: 'var(--bs-warning)'
    }
    ]
});

function open(type: string, message: string, options: { [key: string]: any }): NotyfNotification {
    return notyf.open({
        type,
        message,
        ...options
    })
}

export const toastr = {
    success: function (msg: string, options: { [key: string]: any } = {}): NotyfNotification {
        return open('success', msg, options)
    },
    error: function (msg: string, options: { [key: string]: any } = {}): NotyfNotification {
        return open('error', msg, options)
    },
    warning: function (msg: string, options: { [key: string]: any } = {}): NotyfNotification {
        return open('warning', msg, options)
    },
    info: function (msg: string, options: { [key: string]: any } = {}): NotyfNotification {
        return open('info', msg, options)
    },
    dismiss: (notification: NotyfNotification) => notyf.dismiss(notification),
    dismissAll: () => notyf.dismissAll()
}
