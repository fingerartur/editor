import * as React from 'react';
import { Trans } from 'react-i18next';
import Button from 'gui/utils/Button';
import { Rule } from 'rule/Rule';

interface IProps {
    rule: Rule;
}
interface IState {}

class ExportTextButton extends React.Component<IProps, IState> {
    private aDownload: HTMLAnchorElement;
    constructor(props: any) {
        super(props);
    }

    exportText = () => {
        const dataUrl = 'data:text/json;charset=utf-8,'  + encodeURIComponent(JSON.stringify(this.props.rule.serialize()));
        this.aDownload.href = dataUrl;
        this.aDownload.download = 'exported.json';
        this.aDownload.click();
    }

    render() {
        return (
            <>
                <Button
                    onClick={this.exportText}
                    style={{ marginLeft: 5, backgroundColor: '#e6faff' }}
                    size="small"
                >
                    <Trans>save_text</Trans>     
                </Button>
                <a style={{ display: 'none' }} href="#" ref={(ref) => { this.aDownload = ref; }}/>
            </>
        );
    }
}

export default ExportTextButton;