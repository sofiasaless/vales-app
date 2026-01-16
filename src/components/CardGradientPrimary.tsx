import { LinearGradient } from "expo-linear-gradient"
import React, { ReactNode } from "react"
import { customTheme } from "../theme/custom.theme"

export const CardGradientPrimary: React.FC<{
  styles?: any, 
  children: ReactNode,
  colors_one?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
  colors_two?: '1' | '2' | '3' | '4',
}> = ({children, styles, colors_one = '900', colors_two = '2'}) => {
  return (
    <LinearGradient
      colors={[
        customTheme[`color-primary-${colors_one}`],
        customTheme[`background-basic-color-${colors_two}`]
      ]}
      start={{ x: 0, y: 5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles}
    >
      {children}
    </LinearGradient>
  )
}