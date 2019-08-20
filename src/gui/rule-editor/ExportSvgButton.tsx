import * as React from 'react';
import Button from '../utils/Button';
import { Trans } from 'react-i18next';

interface IProps {
    generateSvgDataUrl: Function;
}
interface IState {}

class ExportSvgButton extends React.Component<IProps, IState> {
    private aDownload: HTMLAnchorElement;

    constructor(props: any) {
        super(props);
    }

    // scheduleSvgExport = () => {
    //     // this hack allows me to show spinner without running
    //     // export asnychronously
    //     this.setState({ isExportingSvg: true});
    //     setTimeout(() => {
    //         this.exportSvg();
    //         this.setState({ isExportingSvg: false});
    //     }, 20);
    // }

    // {
    //     this.state.isExportingSvg ?
    //     <Spin size="small" style={{marginLeft: 15}}/>
    //     : null
    // }

    exportSvg = () => {
        const dataUrl = this.props.generateSvgDataUrl();
        this.aDownload.href = dataUrl;
        this.aDownload.download = 'exported.svg';
        this.aDownload.click();
    }

    render() {
        return (
            <>
                <Button
                    onClick={this.exportSvg}
                    size="small"
                >
                    <Trans>save_svg</Trans>                
                </Button>
                <a style={{ display: 'none' }} href="#" ref={(ref) => { this.aDownload = ref; }}/>
            </>
        );
    }
}

export default ExportSvgButton;