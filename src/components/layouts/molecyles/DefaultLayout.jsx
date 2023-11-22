import React from 'react'
import { Header } from './Header'
import {Loader} from './Loading'

export default function DefaultLayout({children}) {
  return (
    <div>
      <Header/>
      <Loader/>
      {children}
    </div>
  )
}
