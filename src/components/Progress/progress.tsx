import { type ThemeProps } from '../Icon/icon'

export interface ProgressProps {
    percent: number;
    strokeHeight?: number;
    showText?: boolean;
    styles?: React.CSSProperties;
    theme?: ThemeProps;
}

const Progress = ({
    percent,
    strokeHeight = 15,
    showText = true,
    styles = {},
    theme = 'primary',
}: ProgressProps) => {
    return (
        <div className="progress-bar" style={styles}>
            {/* 灰色最外层 */}
            <div className="progress-bar-outer" style={{ height: `${strokeHeight}px` }}>
                <div
                    className={`progress-bar-inner color-${theme}`}
                    style={{ width: `${percent}%` }}
                >
                    {showText && <span className="inner-text">{`${percent}%`}</span>}
                </div>
            </div>
        </div>
    )
}

export default Progress
