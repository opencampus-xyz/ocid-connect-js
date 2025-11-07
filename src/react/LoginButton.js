/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* eslint-disable react/no-unknown-property */
import React from 'react';
import { useOCAuth } from './OCContext';

const lightTheme = {
    background: "#000",
    color: "#fff",
    button: {
        background: "#FFF",
        border: "#DDDDEB",
        color: "#C5C5D1",
        colorSuccess: "#8F8FB2",
    },
};

const darkTheme = {
    background: "#fff",
    color: "#000",
    button: {
        background: "#141414",
        border: "#DDDDEB",
        color: "#FFFFFF",
        colorSuccess: "#ADADB8",
    },
};

const neutralTheme = {
    background: "#fff",
    color: "#000",
    button: {
        background: "#F5F5F5",
        border: "#DDDDEB",
        color: "#141414",
        colorSuccess: "#8F8FB2",
    },
};

const ocBlueTheme = {
    background: "#fff",
    color: "#000",
    button: {
        background: "#141BEB",
        border: "#DDDDEB",
        color: "#FFFFFF",
        colorSuccess: "#9699EB",
    },
};

const themes = {
    light: lightTheme,
    dark: darkTheme,
    neutral: neutralTheme,
    ocBlue: ocBlueTheme,
};

const genStyle = ( theme, pill = false ) =>
( {
    display: "flex",
    alignItems: "center",
    height: 44,
    width: 160,
    padding: "10px 12px",
    fontSize: 14,
    border: "1px solid",
    borderColor: theme.button.border,
    borderRadius: pill ? 40 : 8,
    background: theme.button.background,
    color: theme.button.color
} );

export default function LoginButton ( {
    pill,
    disabled,
    theme,
    state,
    emailPlaceholder
} )
{
    const { ocAuth } = useOCAuth();
    const customTheme = themes[ theme ] || themes[ 'ocBlue' ];

    const loginWithRedirect = async () =>
    {
        await ocAuth.signInWithRedirect( {
            state,
            emailPlaceholder
        } );
    };

    const style = genStyle( customTheme, pill );

    return (
        <button
            disabled={ disabled }
            onClick={ loginWithRedirect }
            style={ style }
        >
            <img alt="logo" src="https://static.opencampus.xyz/assets/oc_logo.svg" width="26px" height="25px" />
            <span style={ { marginLeft: "10px" } }>Connect&nbsp;<strong>OCID</strong></span>
        </button>
    );
}