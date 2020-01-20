import React from 'react';
import GenericModalMenuSection from '../commons/GenericModalMenuSection';
import Icon from 'components/commons/Icon';

const Component = ({ uiState, uiStateActions }) => {
	return (
		<GenericModalMenuSection
			uiState={uiState}
			uiStateActions={uiStateActions}
			sectionKey='suche-im-kartenausschnitt'
			sectionTitle='Suche im Kartenausschnitt'
			sectionBsStyle='success'
			sectionContent={
				<div>
					<p>
						Durch Anklicken von&nbsp;
						<Icon name='search' />
						&nbsp;suchen Sie nach B-Pl&auml;nen, die zumindest teilweise im aktuellen
						Kartenausschnitt liegen.
					</p>
					<p>
						Den Kartenausschnitt k&ouml;nnen Sie durch Ziehen mit der Maus verschieben.
						Mit den Werkzeugen&nbsp;
						<Icon name='plus' />
						&nbsp;und&nbsp;
						<Icon name='minus' />
						&nbsp;k&ouml;nnen Sie den Kartenma&szlig;stab vergr&ouml;&szlig;ern bzw.
						verkleinern.
					</p>
					<p>
						Mit einem Doppelklick auf einen B-Plan in der Hintergrundkarte werden alle
						B-Pl&auml;ne geladen, die an dieser Stelle liegen - meistens genau einer,
						manchmal auch mehrere Pl&auml;ne. Ein Doppelklick auf die Hintergrundkarte{' '}
						<b>au&szlig;erhalb</b> der angezeigten B-Pl&auml;ne entfernt alle zuvor
						geladenen B-Pl&auml;ne (Zur&uuml;cksetzen der Suche).
					</p>
				</div>
			}
		/>
	);
};
export default Component;
