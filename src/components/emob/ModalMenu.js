import React from 'react';
import ModalMenuIntroduction from './ModalMenuIntroduction';
import ModalMenuHelpSection from './ModalMenuHelpSection';
import GenericModalApplicationMenu from 'components/commons/GenericModalApplicationMenu';
import GenericModalMenuSection from 'components/commons/GenericModalMenuSection';
import ModalMenuSettingsPanel from './ModalMenuSettingsPanel';
import ModalMenuFilterPanel from './FilterPaneContent';
import { getColorForProperties } from '../../utils/emobHelper';

import Footer from '../commons/ModalMenuFooter';
import PieChart from './PieChart';

const ModalMenu = ({
  uiState,
  uiStateActions,
  urlPathname,
  urlSearch,
  pushNewRoute,
  currentMarkerSize,
  changeMarkerSymbolSize,
  topicMapRef,
  setLayerByKey,
  activeLayerKey,
  refreshFeatureCollection,
  setFeatureCollectionKeyPostfix,
  filter,
  setFilter,
  filteredObjects,
  featureCollectionObjectsCount,
  steckertypes,
}) => {
  const filteredObjectsCount = (filteredObjects || []).length;
  let rightTerm = filteredObjectsCount !== 1 ? 'Ladestationen' : 'Ladestation';
  let filterSubTitle = `(${filteredObjectsCount} ${rightTerm} gefunden, davon ${featureCollectionObjectsCount} in der Karte)`;
  return (
    <GenericModalApplicationMenu
      uiState={uiState}
      uiStateActions={uiStateActions}
      menuIntroduction={<ModalMenuIntroduction uiStateActions={uiStateActions} />}
      menuTitle="Filter, Einstellungen und Kompaktanleitung"
      menuSections={[
        <GenericModalMenuSection
          uiState={uiState}
          uiStateActions={uiStateActions}
          sectionKey="filter"
          sectionTitle={'Filter ' + filterSubTitle}
          sectionBsStyle="primary"
          sectionContent={
            <ModalMenuFilterPanel
              width={uiState.width}
              filter={filter}
              setFilter={setFilter}
              steckertypes={steckertypes}
              pieChart={
                <PieChart
                  filteredObjects={filteredObjects}
                  colorizer={getColorForProperties}
                  groupingFunction={(obj) => {
                    if (obj.online === true) {
                      return 'online';
                    } else {
                      return 'offline';
                    }
                  }}
                />
              }
            />
          }
        />,
        <ModalMenuSettingsPanel
          key="ModalMenuSettingsPanel"
          uiState={uiState}
          uiStateActions={uiStateActions}
          width={uiState.width}
          pushNewRoute={pushNewRoute}
          currentMarkerSize={currentMarkerSize}
          changeMarkerSymbolSize={changeMarkerSymbolSize}
          urlPathname={urlPathname}
          urlSearch={urlSearch}
          topicMapRef={topicMapRef}
          setLayerByKey={setLayerByKey}
          activeLayerKey={activeLayerKey}
          refreshFeatureCollection={refreshFeatureCollection}
          setFeatureCollectionKeyPostfix={setFeatureCollectionKeyPostfix}
        />,

        <ModalMenuHelpSection
          key="ModalMenuHelpSection"
          uiState={uiState}
          uiStateActions={uiStateActions}
        />,
      ]}
      menuFooter={
        <Footer
          showModalMenu={(section) =>
            uiStateActions.showApplicationMenuAndActivateSection(true, section)
          }
        />
      }
    />
  );
};
export default ModalMenu;
