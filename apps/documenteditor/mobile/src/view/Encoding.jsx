import React, {Component, useEffect, useState} from 'react';
import { f7, Page, Navbar, List, ListItem, BlockTitle, ListButton, Popover, Popup, View, Link } from "framework7-react";
import { useTranslation } from "react-i18next";
import { Device } from '../../../../common/mobile/utils/device';

const PageEncoding = props => {
    const { t } = useTranslation();
    const _t = t("View.Settings", { returnObjects: true });
    const pagesName = props.pagesName;
    const pages = props.pages;
    const [stateEncoding, setStateEncoding] = useState(props.valueEncoding);
    const nameEncoding = pagesName[pages.indexOf(stateEncoding)];
    const mode = props.mode;

    const changeStateEncoding = value => {
        setStateEncoding(value);
    }

    return (
        <View style={props.style} routes={routes}>
            <Page>
                <Navbar title={_t.textChooseCsvOptions} />
                <BlockTitle>{_t.textEncoding}</BlockTitle>
                <List>
                    <ListItem title={nameEncoding} link="/encoding-list/" routeProps={{
                        stateEncoding,
                        pages: props.pages,
                        pagesName: props.pagesName,
                        changeStateEncoding
                    }}></ListItem>
                </List>
                <List className="buttons-list">
                    {mode === 2 ? 
                        <ListButton className='button-fill button-raised' title={_t.textCancel} onClick={() => props.closeModal()}></ListButton>
                    : null}
                    <ListButton className='button-fill button-raised' title={mode === 2 ?_t.textDownload : _t.txtOk} onClick={() => props.onSaveFormat(stateEncoding)}></ListButton>
                </List>
            </Page>
        </View>
        
    )
};

const PageEncodingList = props => {
    const { t } = useTranslation();
    const _t = t("View.Settings", { returnObjects: true });
    const [currentEncoding, changeCurrentEncoding] = useState(props.stateEncoding);
    const pages = props.pages;
    const pagesName = props.pagesName;
    
    return (
        <Page>
            <Navbar title={_t.txtDownloadCsv} backLink={_t.textBack} />
            <BlockTitle>{_t.textChooseEncoding}</BlockTitle>
            <List>
                {pagesName.map((name, index) => {
                    return (
                        <ListItem radio checked={currentEncoding === pages[index]} title={name} key={index} value={pages[index]} onChange={() => {
                            changeCurrentEncoding(pages[index]);
                            props.changeStateEncoding(pages[index]);
                            f7.views.current.router.back();
                        }}></ListItem>
                    )
                })}
            </List>
        </Page>
    )
};

class EncodingView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const show_popover = this.props.usePopover;

        return (
            show_popover ?
                <Popover id="encoding-popover" className="popover__titled" closeByBackdropClick={false} closeByOutsideClick={false}>
                    <PageEncoding 
                        inPopover={true} 
                        onSaveFormat={this.props.onSaveFormat}
                        closeModal={this.props.closeModal}
                        mode={this.props.mode}  
                        pages={this.props.pages}
                        pagesName={this.props.pagesName}
                        valueEncoding={this.props.valueEncoding}
                        style={{height: '410px'}}
                    />
                </Popover> :
                <Popup className="encoding-popup">
                    <PageEncoding 
                        onSaveFormat={this.props.onSaveFormat} 
                        closeModal={this.props.closeModal}
                        mode={this.props.mode}  
                        pages={this.props.pages}
                        pagesName={this.props.pagesName}
                        valueEncoding={this.props.valueEncoding}
                    />
                </Popup>
        )
    }
}

const routes = [
    {
        path: '/encoding-list/',
        component: PageEncodingList
    }
];

const Encoding = props => {
    useEffect(() => {
        if ( Device.phone )
            f7.popup.open('.encoding-popup');
        else f7.popover.open('#encoding-popover', "#btn-settings");

        return () => {
        }
    });

    return (
        <EncodingView 
            usePopover={!Device.phone} 
            closeModal={props.closeModal}
            onSaveFormat={props.onSaveFormat} 
            mode={props.mode}  
            pages={props.pages}
            pagesName={props.pagesName}
            valueEncoding={props.valueEncoding}
        />
    )
};

export {Encoding, PageEncodingList}