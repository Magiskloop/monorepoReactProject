import React from 'react'
import styles from './app.module.less'
import { HashRouter, useRoutes } from 'react-router-dom'
import { router } from './router'

type Props = {}

const Router = () => useRoutes(router)

export default function App({ }: Props) {
    return (
        <HashRouter>
            <Router />
        </HashRouter>
    )
}
