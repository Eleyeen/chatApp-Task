import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

export type TextComponentProps = {
	text?: React.ReactNode;
	numberOfLines?: number;
	adjustsFontSizeToFit?: boolean;
	style?: StyleProp<TextStyle>;
	css?: StyleProp<TextStyle>; // alias to style for convenience
} & Omit<TextProps, 'style' | 'numberOfLines' | 'adjustsFontSizeToFit'>;

const TextComponent: React.FC<TextComponentProps> = ({
	text,
	numberOfLines,
	adjustsFontSizeToFit,
	style,
	css,
	children,
	...rest
}) => {
	return (
		<Text
			numberOfLines={numberOfLines}
			adjustsFontSizeToFit={adjustsFontSizeToFit}
			style={[style, css]}
			{...rest}
		>
			{text ?? children}
		</Text>
	);
};

export default TextComponent; 