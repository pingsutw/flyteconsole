import { makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { COLOR_SPECTRUM } from 'components/Theme/colorSpectrum';
import { DataTable } from 'components/common/DataTable';
import { Admin } from '@flyteorg/flyteidl-types';
import { isEmpty } from 'lodash';
import { LocalCacheItem, useLocalCache } from 'basics/LocalCache';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import t from './strings';

const useStyles = makeStyles((theme: Theme) => ({
  domainSettingsWrapper: {
    padding: theme.spacing(0, 2, 0, 2),
  },
  collapseButton: {
    marginTop: theme.spacing(-0.5),
  },
  domainSettings: {
    padding: theme.spacing(2, 4, 0, 4),
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  subHeader: {
    margin: 0,
    paddingBottom: theme.spacing(2),
    fontSize: '16px',
    fontWeight: 600,
  },
  grayText: {
    padding: theme.spacing(1, 0, 1, 0),
    color: COLOR_SPECTRUM.gray40.color,
  },
}));

interface DomainSettingsSectionProps {
  taskResourceAttributes?: Admin.ITaskResourceAttributes,
  executionQueueAttributes?: Admin.IExecutionQueueAttributes,
  executionClusterLabel?: Admin.IExecutionClusterLabel,
  pluginOverrides?: Admin.IPluginOverrides,
  workflowExecutionConfig?: Admin.IWorkflowExecutionConfig;
  clusterAssignment?: Admin.IClusterAssignment;
}

export const DomainSettingsSection = ({taskResourceAttributes, executionQueueAttributes, executionClusterLabel, pluginOverrides, workflowExecutionConfig, clusterAssignment}: DomainSettingsSectionProps) => {
  const styles = useStyles();
  const [showTable, setShowTable] = useLocalCache(
    LocalCacheItem.ShowDomainSettings,
  );

  if (!workflowExecutionConfig || isEmpty(workflowExecutionConfig)) {
    return null;
  }

  const role = workflowExecutionConfig.securityContext?.runAs?.iamRole || t('noValue');
  const serviceAccount =
    workflowExecutionConfig.securityContext?.runAs?.k8sServiceAccount || t('noValue');
  const rawData =
    workflowExecutionConfig.rawOutputDataConfig?.outputLocationPrefix || t('noValue');
  const maxParallelism = workflowExecutionConfig.maxParallelism || 0;

  const cpuLimit = taskResourceAttributes?.limits?.cpu || undefined;
  const memoryLimit = taskResourceAttributes?.limits?.memory || undefined;
  const gpuLimit = taskResourceAttributes?.limits?.gpu || undefined;
  const storageLimit = taskResourceAttributes?.limits?.storage || undefined;
  const ephemeralStorageLimit = taskResourceAttributes?.limits?.ephemeralStorage || undefined;

  const cpuRequest = taskResourceAttributes?.defaults?.cpu || undefined;
  const memoryRequest = taskResourceAttributes?.defaults?.memory || undefined;
  const gpuRequest = taskResourceAttributes?.defaults?.gpu || undefined;
  const storageRequest = taskResourceAttributes?.defaults?.storage || undefined;
  const ephemeralStorageRequest = taskResourceAttributes?.defaults?.ephemeralStorage || undefined;

  const tags = executionQueueAttributes?.tags?.map( (e) => (e + " ") ).join(' ') || undefined;
  const clusterLabel = executionClusterLabel?.value || undefined;
  const pluginOverridesList = pluginOverrides?.overrides || undefined;

  return (
    <div className={styles.domainSettingsWrapper}>
      <Typography className={styles.title} variant="h6">
        <IconButton
          className={styles.collapseButton}
          edge="start"
          disableRipple={true}
          disableTouchRipple={true}
          onClick={() => setShowTable(!showTable)}
          onMouseDown={e => e.preventDefault()}
          size="small"
          title={t('collapseButton', showTable)}
        >
          {showTable ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        {t('domainSettingsTitle')}
      </Typography>
      {showTable && (
        <div className={styles.domainSettings}>
          <div>
            <p className={styles.subHeader}>{t('securityContextHeader')}</p>
            <div>
              <Typography variant="body1" className={styles.grayText}>
                {t('iamRoleHeader')}
              </Typography>
              <Typography variant="body2">{role}</Typography>
            </div>
            <div>
              <Typography variant="body1" className={styles.grayText}>
                {t('serviceAccountHeader')}
              </Typography>
              <Typography variant="body2">{serviceAccount}</Typography>
            </div>
          </div>
          <div>
            <p className={styles.subHeader}>{t('labelsHeader')}</p>
            {workflowExecutionConfig.labels?.values ? (
              <DataTable data={workflowExecutionConfig.labels.values} />
            ) : (
              t('noValue')
            )}
          </div>
          <div>
            <p className={styles.subHeader}>{t('annotationsHeader')}</p>
            {workflowExecutionConfig.annotations?.values ? (
              <DataTable data={workflowExecutionConfig.annotations.values} />
            ) : (
              t('noValue')
            )}
          </div>
          <div>
            <div>
              <p className={styles.subHeader}>{t('rawDataHeader')}</p>
              <Typography variant="body2">{rawData}</Typography>
            </div>
            <div>
              <p className={styles.subHeader} style={{ paddingTop: '20px' }}>
                {t('maxParallelismHeader')}
              </p>
              <Typography variant="body2">
                {maxParallelism ?? t('noValue')}
              </Typography>
            </div>
          </div>
          <div>
            <div>
              <p className={styles.subHeader}>{t('request')}</p>
              <Typography variant="body2">{t('cpu')}: {cpuRequest ?? t('noValue')}</Typography>
              <Typography variant="body2">{t('memory')}: {memoryRequest ?? t('noValue')}</Typography>
              <Typography variant="body2">{t('gpu')}: {gpuRequest ?? t('noValue')}</Typography>
              <Typography variant="body2">{t('storage')}: {storageRequest ?? t('noValue')}</Typography>
              <Typography variant="body2">{t('ephemeralStorage')}: {ephemeralStorageRequest ?? t('noValue')}</Typography>
            </div>
          </div>
          <div>
            <div>
              <p className={styles.subHeader}>{t('limit')}</p>
              <Typography variant="body2">{t('cpu')}: {cpuLimit}</Typography>
              <Typography variant="body2">{t('memory')}: {memoryLimit}</Typography>
              <Typography variant="body2">{t('gpu')}: {gpuLimit ?? t('noValue')}</Typography>
              <Typography variant="body2">{t('storage')}: {storageLimit ?? t('noValue')}</Typography>
              <Typography variant="body2">{t('ephemeralStorage')}: {ephemeralStorageLimit ?? t('noValue')}</Typography>
            </div>
          </div>
          <div>
            <div>
              <p className={styles.subHeader}>{t('tags')}</p>
              <Typography variant="body2">{tags ?? t('noValue')}</Typography>
            </div>
          </div>
          <div>
            <div>
              <p className={styles.subHeader}>{t('clusterLabel')}</p>
              <Typography variant="body2">{clusterLabel ?? t('noValue')}</Typography>
            </div>
          </div>
          <div>
            <div>
              <p className={styles.subHeader}>{t('pluginOverrides')}</p>
              <div>{pluginOverridesList?.map((item) => {
                return (
                <div key={`plugin-div-${item.taskType}`}>
                  <Typography variant="body2" key={`plugin-${item.taskType}`}> Task Type: {item.taskType} </Typography>
                  <Typography variant="body2" key={`plugin-id-${item.taskType}`}> Plugin id: {item.pluginId?.map((item) => item + ' ').join('')} </Typography>
                  <Typography variant="body2" key={`plugin-bh-${item.taskType}`}> Missing Plugin Behavior: {item.missingPluginBehavior ? "Fail": "Default"} </Typography>
                </div>
                );})}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
