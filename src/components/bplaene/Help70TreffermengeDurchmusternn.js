import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';

const Component = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="treffermenge-durchmustern"
      sectionTitle="Treffermengen durchmustern"
      sectionBsStyle="info"
      sectionContent={
        <div>
          Der beste Treffer einer Suche erhält den Fokus (blaue Umrandung). In der Info-Box werden
          Ihnen immer die Detailinformationen und die Verknüpfung zur Dokumentbetrachtung für
          denjenigen B-Plan angeboten, der gerade den Fokus hat. Mit einem einfachen Klick auf eine
          andere B-Plan-Fläche aus der Treffermenge erhält der zugehörige B-Plan den Fokus. Mit
          einem weiteren Klick auf diese Fläche wird der Kartenausschnitt so angepasst, dass der
          zugehörige B-Plan vollständig und zentriert dargestellt wird.
          <br />
          Mit einem weiteren Klick wird der Kartenausschnitt so angepasst, dass dieser Plan
          vollst&auml;ndig und zentriert dargestellt wird. Alternativ k&ouml;nnen Sie die
          Treffermenge mit den Schaltfl&auml;chen <a>&gt;&gt;</a> (n&auml;chster Treffer) und &nbsp;
          <a>&lt;&lt;</a> (vorheriger Treffer) durchmustern. (Die Treffermenge ist geordnet nach
          zunehmendem Abstand des Plans vom Bezugspunkt ihrer Suche.)
          <br />
          Mit&nbsp;
          <a>alle Treffer anzeigen</a>
          &nbsp; k&ouml;nnen Sie den Kartenausschnitt zuvor so anpassen, dass alle Pl&auml;ne der
          Treffermenge vollst&auml;ndig angezeigt werden.
        </div>
      }
    />
  );
};
export default Component;
