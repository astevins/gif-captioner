import React from "react";
import '../stylesheets/ErrorMessage.scss';

/** Prepares a formatted error message. */
export function ErrorMessage(props: {message: string | null}) {
    if (props.message) {
        return (
            <p className="error-msg">
                {"Error: " + props.message}
            </p>);
    } else {
        return null;
    }
}