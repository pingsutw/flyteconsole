import { Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { contentMarginGridUnits } from 'common/layout';
import { WaitForData } from 'components/common/WaitForData';
import { ExecutionFilters } from 'components/Executions/ExecutionFilters';
import { useWorkflowExecutionFiltersState } from 'components/Executions/filters/useExecutionFiltersState';
import { WorkflowExecutionsTable } from 'components/Executions/Tables/WorkflowExecutionsTable';
import { isLoadingState } from 'components/hooks/fetchMachine';
import { useWorkflowExecutions } from 'components/hooks/useWorkflowExecutions';
import { SortDirection } from 'models/AdminEntity/types';
import { ResourceIdentifier } from 'models/Common/types';
import { executionSortFields } from 'models/Execution/constants';
import * as React from 'react';
import { executionFilterGenerator } from './generators';

const useStyles = makeStyles((theme: Theme) => ({
    filtersContainer: {
        borderTop: `1px solid ${theme.palette.divider}`
    },
    header: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(contentMarginGridUnits)
    }
}));

export interface EntityExecutionsProps {
    id: ResourceIdentifier;
    chartIds: string[];
    clearCharts: () => void;
}

/** The tab/page content for viewing a workflow's executions */
export const EntityExecutions: React.FC<EntityExecutionsProps> = ({
    id,
    chartIds,
    clearCharts
}) => {
    const { domain, project, resourceType } = id;
    const styles = useStyles();
    const filtersState = useWorkflowExecutionFiltersState();
    const sort = {
        key: executionSortFields.createdAt,
        direction: SortDirection.DESCENDING
    };

    const baseFilters = React.useMemo(
        () => executionFilterGenerator[resourceType](id),
        [id]
    );

    const executions = useWorkflowExecutions(
        { domain, project },
        {
            sort,
            filter: [...baseFilters, ...filtersState.appliedFilters]
        }
    );

    if (chartIds.length > 0)
        executions.value = executions.value.filter(item =>
            chartIds.includes(item.id.name)
        );
    /** Don't render component until finish fetching user profile */
    if (filtersState.filters[4].status !== 'LOADED') {
        return null;
    }

    return (
        <>
            <Typography className={styles.header} variant="h6">
                All Executions in the Workflow
            </Typography>
            <div className={styles.filtersContainer}>
                <ExecutionFilters
                    {...filtersState}
                    chartIds={chartIds}
                    clearCharts={clearCharts}
                />
            </div>
            <WaitForData {...executions}>
                <WorkflowExecutionsTable
                    {...executions}
                    isFetching={isLoadingState(executions.state)}
                />
            </WaitForData>
        </>
    );
};
