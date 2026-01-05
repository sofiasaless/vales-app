import { LinearGradient } from "expo-linear-gradient"
import { customTheme } from "../theme/custom.theme"
import React, { ReactNode } from "react"

export const CardGradient: React.FC<{styles?: any, children: ReactNode}> = ({children, styles}) => {
  return (
    <LinearGradient
      colors={[
        customTheme['background-basic-color-4'],
        customTheme['background-basic-color-2']
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.5 }}
      style={styles}
    >
      {children}
    </LinearGradient>
  )
}