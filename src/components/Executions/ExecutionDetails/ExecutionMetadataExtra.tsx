import { Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as classnames from 'classnames';
import { useCommonStyles } from 'components/common/styles';
import { Execution } from 'models/Execution/types';
import * as React from 'react';
import { ExecutionMetadataLabels } from './constants';
import { getLaunchPlan } from 'models/Launch/api';
import { LaunchPlanSpec } from 'models/Launch/types';

const useStyles = makeStyles((theme: Theme) => {
    return {
        detailItem: {
            flexShrink: 0,
            marginLeft: theme.spacing(4)
        }
    };
});

interface DetailItem {
    className?: string;
    label: React.ReactNode;
    value: React.ReactNode;
}

/**
 * Renders extra metadata details about a given Execution
 * @param execution
 * @constructor
 */
export const ExecutionMetadataExtra: React.FC<{
    execution: Execution;
}> = ({ execution }) => {
    const commonStyles = useCommonStyles();
    const styles = useStyles();

    const { launchPlan: launchPlanId, maxParallelism } = execution.spec;
    const [launchPlanSpec, setLaunchPlanSpec] = React.useState<
        Partial<LaunchPlanSpec>
    >({});

    React.useEffect(() => {
        getLaunchPlan(launchPlanId).then(({ spec }) => setLaunchPlanSpec(spec));
    }, [launchPlanId]);

    const details: DetailItem[] = [
        {
            label: ExecutionMetadataLabels.serviceAccount,
            value: launchPlanSpec?.authRole?.kubernetesServiceAccount
        },
        {
            label: ExecutionMetadataLabels.rawOutputPrefix,
            value: launchPlanSpec?.rawOutputDataConfig?.outputLocationPrefix
        },
        {
            label: ExecutionMetadataLabels.parallelism,
            value: maxParallelism
        }
    ];

    return (
        <>
            {details.map(({ className, label, value }, idx) => (
                <div
                    className={classnames(styles.detailItem, className)}
                    key={idx}
                >
                    <Typography
                        className={commonStyles.truncateText}
                        variant="subtitle1"
                    >
                        {label}
                    </Typography>
                    <Typography
                        className={commonStyles.truncateText}
                        variant="h6"
                        data-testid={`metadata-${label}`}
                    >
                        {value}
                    </Typography>
                </div>
            ))}
        </>
    );
};
