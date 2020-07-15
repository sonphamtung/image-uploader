import React, { Component } from 'react';

interface IProps {
    height?: number;
    color?: string;
    style?: StyleSheet;
    id?: string;
    className?: string;
    show?: boolean;
}

export default class ProgressBar extends Component<IProps, { width: number }> {
    state = {
        width: 0,
    };

    intervalId: any;

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({
                width: this.state.width + (1 - this.state.width) * 0.2,
            });
        }, 500 + 200 * Math.random());
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getStyles = () => {
        const styles = {
            main: {
                height: this.props.height || 10,
                backgroundColor: this.props.color || '#20a8d8',
                backgroundImage:
                    'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                backgroundSize: '1rem 1rem',
                transition: 'width 0.5s',
                width: Math.floor(this.state.width * 100) + '%',
            },
            container: {
                backgroundColor: '#f0f3f5',
                marginTop: '5px',
                width: '100%',
            },
        };

        if (this.props.style) {
            styles.main = Object.assign({}, this.props.style, styles.main);
        }

        return styles;
    };

    render() {
        const styles = this.getStyles();

        const { id, className } = this.props;

        return (
            (this.props.show && (
                <div style={styles.container}>
                    <div {...{ id, className }} style={styles.main} />
                </div>
            )) ||
            null
        );
    }
}
